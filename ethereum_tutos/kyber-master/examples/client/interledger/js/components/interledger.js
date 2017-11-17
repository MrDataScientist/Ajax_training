import React from 'react';

import { Navbar } from 'react-bootstrap/lib';

import AccountList from '../../../js/react/components/account_list';
import AccountDetail from './account_detail';

import AssetActions from '../../../js/react/actions/asset_actions';

import BigchainDBConnection from '../../../js/react/components/bigchaindb_connection';


const Interledger = React.createClass({
    propTypes: {
        // Injected through BigchainDBConnection
        accountList: React.PropTypes.array,
        activeAccount: React.PropTypes.object,
        activeAsset: React.PropTypes.object,
        assetList: React.PropTypes.object,
        handleAccountChange: React.PropTypes.func,
        handleAssetChange: React.PropTypes.func
    },

    fetchAssetList({ account }) {
        if (account) {
            AssetActions.fetchAssetList({
                account
            });
        }
    },

    render() {
        const {
            accountList,
            activeAccount,
            activeAsset,
            assetList,
            handleAccountChange,
            handleAssetChange
        } = this.props;

        return (
            <div>
                <Navbar fixedTop inverse>
                    <h1 style={{ textAlign: 'center', color: 'white' }}>Interledger</h1>
                </Navbar>
                <div id="wrapper">
                    <div id="page-content-wrapper">
                        <div className="page-content">
                            <AccountList
                                activeAccount={activeAccount}
                                appName="interledger"
                                className="row"
                                handleAccountClick={handleAccountChange}>
                                <AccountDetail
                                    accountList={accountList}
                                    activeAsset={activeAsset}
                                    assetList={assetList}
                                    handleAssetClick={handleAssetChange} />
                            </AccountList>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default BigchainDBConnection(Interledger);
