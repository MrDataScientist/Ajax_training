import React, {PropTypes, Component} from 'react'
import SpeechRecognition from 'react-speech-recognition'
import classnames from 'classnames';

import TransactionActions from '../../../js/react/actions/transaction_actions';
import { fetchAsset } from './utils';

import * as driver from 'js-bigchaindb-quickstart';

import { IconLockLocked } from '../../../js/react/components/icons';


const propTypes = {
    assetAccount: PropTypes.object,
    activeAccount: PropTypes.object,
    onWordHit: PropTypes.func,
    magicWords: PropTypes.array,
    magicWordsThreshold: PropTypes.number,
    // Props injected by SpeechRecognition
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool
};

class Dictaphone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            magicWordHits: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const {
            magicWords,
            magicWordsThreshold
        } = nextProps;

        if (nextProps.transcript !== this.props.transcript) {
            const updatedMagicWordHits =
                this.filterTranscript(nextProps.transcript)
                    .filter((item) => magicWords.indexOf(item) > -1)
                    .concat(this.state.magicWordHits)
                    .filter((value, index, self) => self.indexOf(value) === index);

            if (updatedMagicWordHits.length >= magicWordsThreshold)
                this.onWordHit(updatedMagicWordHits);

            this.setState({
                magicWordHits: updatedMagicWordHits
            });
        }
    }

    onWordHit(updatedMagicWordHits) {
        const {
            activeAsset,
            assetAccount,
            activeAccount,
            onWordHit
        } = this.props;

        const magicFulfillments = updatedMagicWordHits
            .map((word) => driver.Transaction.makeSha256Condition(word, false));

        const magicConditionUris = magicFulfillments
            .map((magicFulfillments) => magicFulfillments.getConditionUri());

        const inputCondition = driver.Transaction.ccJsonLoad(activeAsset.outputs[0].condition.details);
        const magicThreshold = inputCondition.subconditions[1].body.threshold;

        let numMagicFulfillments = 0;
        const targetSubfulfillments = inputCondition
            .subconditions[1].body.subconditions
            .map((condition) => {
                const conditionUri = condition.body.serializeUri();
                if (magicConditionUris.indexOf(conditionUri) > -1) {
                    numMagicFulfillments += 1;
                    return magicFulfillments[magicConditionUris.indexOf(conditionUri)];
                }
                return condition.body;
            });

        console.log('magic hits', numMagicFulfillments, magicThreshold);
        if (numMagicFulfillments < magicThreshold)
            return;

        const transaction = this.transferTransaction(activeAsset, activeAccount);

        let fulfillment = driver.Transaction.makeThresholdCondition(1, undefined, false);

        let fulfillmentAssetAccount = driver.Transaction.makeEd25519Condition(assetAccount.vk, false);
        fulfillment.addSubconditionUri(fulfillmentAssetAccount.getConditionUri());
        let subconditionWords = driver.Transaction.makeThresholdCondition(magicThreshold, undefined, false);

        targetSubfulfillments.forEach((targetSubfulfillment) => {
            if ('preimage' in targetSubfulfillment && !!targetSubfulfillment.preimage) {
                subconditionWords.addSubfulfillment(targetSubfulfillment);
            } else {
                subconditionWords.addSubconditionUri(targetSubfulfillment.serializeUri());
            }
        });
        fulfillment.addSubfulfillment(subconditionWords);

        transaction.inputs[0].fulfillment = fulfillment.serializeUri();
        TransactionActions.postTransaction(transaction);
        fetchAsset(activeAsset.id, assetAccount.vk);

        onWordHit();
    }

    transferTransaction(inputTransaction, toAccount) {
        const metadata = {
            'message': 'Greetings from BigchainDB'
        };

        return driver.Transaction.makeTransferTransaction(
            inputTransaction,
            metadata,
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(toAccount.vk))],
            0
        );
    }

    filterTranscript(transcript) {
        return transcript
            .split(" ")
            .map((transcriptItem) => {
                return transcriptItem
                    .replace(/[\s.]/g, "")
                    .toLowerCase()
            })
            .filter((value, index, self) => self.indexOf(value) === index)
    }

    render() {
        const {
            transcript,
            finalTranscript,
            interimTranscript,
            resetTranscript,
            browserSupportsSpeechRecognition,
            recognition,
            magicWords
        } = this.props;

        console.log(transcript)
        if (!browserSupportsSpeechRecognition) {
            return null
        }

        recognition.lang = 'en-US';

        // const transcriptArray = this.filterTranscript(transcript);
        const { magicWordHits } = this.state;

        return (
            <div className="status status--locked animation-fadein">
                <IconLockLocked />
                <h2 className="status__title">Locked</h2>
                <p className="status__text">You don’t mind talking about it, do you Dave?</p>
                
                <div className="dictaphone">
                    {
                        magicWords.map((magicWord) => {
                            const inMagicList = magicWordHits.indexOf(magicWord) > -1;

                            return (
                                <span className={classnames("dictaphone__word", {"active": inMagicList})}
                                    key={magicWord}>
                                    { magicWord }
                                </span>
                            )
                        })
                    }
                    <div className="dictaphone__interim">
                        { transcript }
                    </div>
                </div>
            </div>
        )
    }
}

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(Dictaphone)