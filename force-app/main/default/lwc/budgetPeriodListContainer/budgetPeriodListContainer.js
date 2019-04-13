import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

import getBudgetPeriods from '@salesforce/apex/BudgetPeriodController.getBudgetPeriods';

import BUDGET_PERIOD_OBJECT from '@salesforce/schema/Budget_Period__c';
import NAME_FIELD from '@salesforce/schema/Budget_Period__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Budget_Period__c.Description__c';
import START_DATE_FIELD from '@salesforce/schema/Budget_Period__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Budget_Period__c.End_Date__c';

export default class BudgetPeriodListContainer extends LightningElement {
    
    budgetPeriodObject = BUDGET_PERIOD_OBJECT;
    budgetPeriodFields = [NAME_FIELD, DESCRIPTION_FIELD, START_DATE_FIELD, END_DATE_FIELD];
    
    @track periods = [];

    @track error = [];

    @track isNew = false;

    @track pageNumber = 1;

    @track pageSize;

    @track totalItemCount = 0;

    @wire(CurrentPageReference) pageRef;

    @wire(getBudgetPeriods, { pageNumber: '$pageNumber' })
    periods;

    handlePeriodSelected(event) {
        console.log('HANDLE PERIOD SELECTED EVENT');
        fireEvent(this.pageRef, 'periodSelected', event.detail);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

    handleNew() {
        this.isNew = true;
    }

    handleBudgetPeriodCreated() {
        this.isNew = false;
        this.pageNumber = 1;
    }

    handleBudgetPeriodCancel() {
        this.isNew = false;
    }

    handlePeriodSelect(event) {
        fireEvent(this.pageRef, 'productSelected', event.detail);
    }
}