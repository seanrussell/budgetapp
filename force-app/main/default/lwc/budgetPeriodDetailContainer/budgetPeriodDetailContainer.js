import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';

import { registerListener, unregisterAllListeners } from 'c/pubsub';

import BUDGET_PERIOD_OBJECT from '@salesforce/schema/Budget_Period__c';
import NAME_FIELD from '@salesforce/schema/Budget_Period__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Budget_Period__c.Description__c';
import START_DATE_FIELD from '@salesforce/schema/Budget_Period__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Budget_Period__c.End_Date__c';

const fields = [
    NAME_FIELD,
    DESCRIPTION_FIELD,
    START_DATE_FIELD,
    END_DATE_FIELD
];

export default class BudgetPeriodDetailContainer extends LightningElement {
    @track recordId;

    budgetPeriodObject = BUDGET_PERIOD_OBJECT;
    budgetPeriodFields = [NAME_FIELD, DESCRIPTION_FIELD, START_DATE_FIELD, END_DATE_FIELD];

    @track period = {};
    @track error;

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, { recordId: '$recordId', fields })
    period;

    connectedCallback() {
        registerListener('periodSelected', this.handlePeriodSelected, this);
    }

    handlePeriodSelected(periodId) {
        this.recordId = periodId;
    }

    handleDelete() {

    }
}