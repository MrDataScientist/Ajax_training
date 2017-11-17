import threading
import multiprocessing
from itertools import groupby

import rethinkdb as r

from bigchaindb import Bigchain
import cryptoconditions as cc

from server.lib.models.accounts import retrieve_accounts
from server.lib.models.assets import escrow_asset, get_subcondition_indices_from_type, fulfill_escrow_asset
from server.config_bigchaindb import get_bigchain


class Connector(object):

    def __init__(self, account1, account2):
        self.accounts = {}
        self.add_accounts(account1)
        self.add_accounts(account2)

    def add_accounts(self, account):
        self.accounts[account['ledger']['id']] = account

    def listen_events(self):
        listeners = []
        for ledger_id in self.accounts.keys():
            listen = threading.Thread(target=self._listen_events, args=(ledger_id,))
            listen.start()
            listeners.append(listen)

        for listen in listeners:
            listen.join()

    def handle_escrow(self, tx, current_ledger_id):
        print('called handle_escrow {}'.format(tx['id']))

        ilp_header = tx['transaction']['data']['payload']['ilp_header']
        if 'hops' not in ilp_header:
            ilp_header['hops'] = []
        ilp_header['hops'].append({
            'ledger': current_ledger_id,
            'txid': tx['id']
        })

        destination_ledger_id = ilp_header['ledger']

        ledger = get_bigchain(ledger_id=destination_ledger_id)
        source = self.accounts[destination_ledger_id]['vk']
        to = ilp_header['account']
        asset_id = ledger.get_owned_ids(source).pop()
        sk = self.accounts[destination_ledger_id]['sk']

        condition = cc.Fulfillment.from_dict(tx['transaction']['conditions'][0]['condition']['details'])

        timelocks, _ = get_subcondition_indices_from_type(condition, cc.TimeoutFulfillment.TYPE_ID)
        expires_at = timelocks[0].expire_time.decode()

        hashlocks, _ = get_subcondition_indices_from_type(condition, cc.PreimageSha256Fulfillment.TYPE_ID)
        execution_condition = hashlocks[0].serialize_uri()

        escrow_asset(bigchain=ledger,
                     source=source,
                     to=to,
                     asset_id=asset_id,
                     sk=sk,
                     expires_at=expires_at,
                     ilp_header=ilp_header,
                     execution_condition=execution_condition)

    def handle_execute(self, tx):
        print('called handle_execute {}'.format(tx['id']))

        ilp_header = tx['transaction']['data']['payload']['ilp_header']

        hop = ilp_header['hops'][0]

        ledger = get_bigchain(ledger_id=hop['ledger'])
        tx_escrow = ledger.get_transaction(hop['txid'])

        source = self.accounts[hop['ledger']]['vk']
        to = source
        asset_id = {
            'txid': hop['txid'],
            'cid': 0
        }
        sk = self.accounts[hop['ledger']]['sk']

        fulfillment = cc.Fulfillment.from_uri(tx['transaction']['fulfillments'][0]['fulfillment'])

        hashlocks, _ = get_subcondition_indices_from_type(fulfillment, cc.PreimageSha256Fulfillment.TYPE_ID)
        execution_fulfillment = hashlocks[0].serialize_uri()

        fulfill_escrow_asset(bigchain=ledger,
                             source=source,
                             to=to,
                             asset_id=asset_id,
                             sk=sk,
                             execution_fulfillment=execution_fulfillment)

    def _listen_events(self, ledger_id):
        ledger = get_bigchain(ledger_id=ledger_id)
        for change in r.table('bigchain').changes().run(ledger.conn):
            if change['old_val'] is None:
                self._handle_block(change['new_val'], ledger_id)

    def _handle_block(self, block, ledger_id):
        """
        1. Alice          ---> [Alice, Chloe] ledger_a
        2. Chloe          ---> [Chloe, Bob]   ledger_b
        3. [Chloe, Bob]   ---> Bob            ledger_b
        4. [Alice, Chloe] ---> Chloe          ledger_a


        1. If chloe not in current owners and if new_owners = [current_owner, chloe] ---> escrow
        2. If current_owners == [chloe] do nothing
        3. If current_owners = [chloe, new_owner] and new_owners = [bob] ---> bob fulfilled hashlock
        4. If new_owner == [chloe] do nothing
        """
        vk = self.accounts[ledger_id]['vk']

        for transaction in block['block']['transactions']:
            current_owners = transaction['transaction']['fulfillments'][0]['current_owners']
            new_owners = transaction['transaction']['conditions'][0]['new_owners']

            # 1.
            if vk not in current_owners and sorted(new_owners) == sorted([vk] + current_owners):
                print('chloe received escrow {}'.format(transaction['id']))
                self.handle_escrow(transaction, ledger_id)
            # 2.
            elif current_owners == [vk]:
                print('skip {}'.format(transaction['id']))
            # 3.
            elif vk in current_owners and vk not in new_owners:
                print('hashlock fulfilled {}'.format(transaction['id']))
                self.handle_execute(transaction)
            # 4.
            elif new_owners == [vk]:
                print('skip {}'.format(transaction['id']))


def get_connector_accounts(db='interledger'):
    b = get_bigchain()
    connector_accounts = []
    accounts_db = retrieve_accounts(b, db)

    for name, accounts in groupby(sorted(accounts_db, key=lambda d: d['name']), key=lambda d: d['name']):
        accounts = list(accounts)
        if len(accounts) == 2:
            connector_accounts.append(tuple(accounts))

    return connector_accounts


def run_connector(account1, account2):
    c = Connector(account1=account1, account2=account2)
    c.listen_events()


if __name__ == '__main__':
    connector_accounts = get_connector_accounts()
    connector_procs = []

    for connector_account in connector_accounts:
        print('Starting connector: {} <--- {} ---> {}'.format(connector_account[0]['ledger']['id'],
                                                              connector_account[0]['name'],
                                                              connector_account[1]['ledger']['id']))

        connector_proc = multiprocessing.Process(target=run_connector, args=connector_account)
        connector_proc.start()
        connector_procs.append(connector_proc)

    for connector_proc in connector_procs:
        connector_proc.join()

