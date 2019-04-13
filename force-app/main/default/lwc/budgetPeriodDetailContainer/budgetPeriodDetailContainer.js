import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getTransactionItemList from '@salesforce/apex/TransactionItemController.getTransactionItems';

import { registerListener, unregisterAllListeners } from 'c/pubsub';

import BUDGET_PERIOD_OBJECT from '@salesforce/schema/Budget_Period__c';
import NAME_FIELD from '@salesforce/schema/Budget_Period__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Budget_Period__c.Description__c';
import START_DATE_FIELD from '@salesforce/schema/Budget_Period__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Budget_Period__c.End_Date__c';

import ID_FIELD from '@salesforce/schema/Transaction_Item__c.Id';
import T_NAME_FIELD from '@salesforce/schema/Transaction_Item__c.Name';
import TYPE_FIELD from '@salesforce/schema/Transaction_Item__c.Type__c';
import AMOUNT_FIELD from '@salesforce/schema/Transaction_Item__c.Amount__c';
import DATE_FIELD from '@salesforce/schema/Transaction_Item__c.Date__c';

const fields = [
    NAME_FIELD,
    DESCRIPTION_FIELD,
    START_DATE_FIELD,
    END_DATE_FIELD
];

const cols = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Type', fieldName: 'Type__c', editable: true },
    { label: 'Amount', fieldName: 'Amount__c', type: 'currency', editable: true },
    { label: 'Date', fieldName: 'Date__c', type: 'date', editable: true }
];

export default class BudgetPeriodDetailContainer extends LightningElement {
    @api recordId;

    budgetPeriodObject = BUDGET_PERIOD_OBJECT;
    budgetPeriodFields = [NAME_FIELD, DESCRIPTION_FIELD, START_DATE_FIELD, END_DATE_FIELD];

    @track period = {};

    @track columns = cols;
    @track draftValues = [];
    @track items = [];
    @track error;

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, { recordId: '$recordId', fields })
    period;

    connectedCallback() {
        registerListener('periodSelected', this.handlePeriodSelected, this);
    }

    handlePeriodSelected(periodId) {
        console.log('PERIOD SELECTED: ', periodId);
        this.recordId = periodId;
        console.log('BUDGET PERIOD: ', this.period);

        getTransactionItemList({budgetPeriodId: periodId})
            .then(result => {
                console.log('RES: ', result);
                this.items = result;
            })
            .catch(error => {
                console.log('ERR: ', error);
                this.error = error;
            });
    }

    handleSave(event) {
        const tFields = {};
        tFields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        tFields[T_NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        tFields[TYPE_FIELD.fieldApiName] = event.detail.draftValues[0].Type__c;
        tFields[AMOUNT_FIELD.fieldApiName] = event.detail.draftValues[0].Amount__c;
        tFields[DATE_FIELD.fieldApiName] = event.detail.draftValues[0].Date__c;

        const recordInput = {tFields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Transaction item updated',
                    variant: 'success'
                })
            );
            
            this.draftValues = [];

            return refreshApex(this.transaction);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}