import random
import logging

import bigchaindb
import bigchaindb.config_utils
from bigchaindb import Bigchain

import apps_config
from server.models.accounts import retrieve_accounts
from server.models.assets import create_asset

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

APPS = apps_config.APPS


def get_accounts_by_name(accounts):
    # returns a dict with key = 'name-<ledger_id>' value = account
    return {'{}-{}'.format(account['name'], account['ledger']['id']): account for account in accounts}


def main():
    for app in APPS:
        app_name = '{}'.format(app['name'])
        if 'num_accounts' in app:
            ledger_name = 'bigchain'.format(app['ledger'])
            bigchain = Bigchain()
            accounts = retrieve_accounts(bigchain, app_name)
            assets = []
            for i in range(app['num_assets']):
                user = accounts[random.randint(0, app['num_accounts'] - 1)]
                asset = create_asset(bigchain=bigchain,
                                     user_pub=user['vk'],
                                     user_priv=user['sk'],
                                     asset=app['payload_func'](i))
                assets.append(asset)
            logging.info('{} assets initialized for app {} on ledger {}'.format(len(assets),
                                                                                app_name,
                                                                                ledger_name))
        elif 'accounts' in app:
            bigchain = bigchaindb.Bigchain()
            accounts_by_name = get_accounts_by_name(retrieve_accounts(bigchain, app['name']))
            for account in app['accounts']:
                for ledger in account['ledgers']:
                    ledger_name = 'bigchaindb_examples_{}'.format(ledger['id'])
                    account_name = '{}-{}'.format(account['name'], ledger['id'])
                    bigchain = bigchaindb.Bigchain(dbname=ledger_name)
                    assets = []
                    for i in range(ledger['num_assets']):
                        asset = create_asset(bigchain=bigchain,
                                             to=accounts_by_name[account_name]['vk'],
                                             payload=app['payload_func'](i))
                        assets.append(asset)
                    logging.info('{} assets initialized for account {} in app {} on ledger {}'
                                 .format(len(assets), account['name'], app_name, ledger_name))


if __name__ == '__main__':
    main()
