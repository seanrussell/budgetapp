import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import deleteBudgetPeriod from '@salesforce/apex/BudgetPeriodController.deleteBudgetPeriod';

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
    @track success = false;

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, { recordId: '$recordId', fields })
    period;

    connectedCallback() {
        registerListener('periodSelected', this.handlePeriodSelected, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handlePeriodSelected(periodId) {
        this.period = {};
        this.recordId = periodId;
    }

    handleDelete() {
        if (this.recordId) {
            deleteBudgetPeriod({budgetPeriodId: this.recordId})
                .then(result => {
                    this.period = {};
                    
                    const event = new ShowToastEvent({
                        title: 'Delete',
                        message: 'Budget period was deleted successfully',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);

                    fireEvent(this.pageRef, 'budgetPeriodDeleted', {});
                })
                .catch(error => {
                    this.error = error;

                    const event = new ShowToastEvent({
                        title: 'Delete',
                        message: 'Budget period unable to be deleted',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);
                });
        }
    }
}