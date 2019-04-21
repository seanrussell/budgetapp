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
    
    @track periods = {};
    @track error = [];
    @track isNew = false;
    @track pageNumber = 1;
    @track pageSize;
    @track totalItemCount = 0;
    @track loaded = false;

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('budgetPeriodDeleted', this.handleBudgetPeriodDeleted, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    
    renderedCallback() {
        if (this.pageNumber && !this.loaded) {
            this.loaded = true;
            this.loadBudgetPeriods();
        }
    }

    loadBudgetPeriods() {
        getBudgetPeriods({pageNumber: this.pageNumber})
                .then(result => {
                    this.periods.data = result;
                })
                .catch(error => {
                    this.error = error;
                });
    }

    handleBudgetPeriodDeleted() {
        this.loadBudgetPeriods();
        fireEvent(this.pageRef, 'budgetPeriodRemoved', {});
    }

    handlePeriodSelected(event) {
        fireEvent(this.pageRef, 'periodSelected', event.detail);
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.loadBudgetPeriods();
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.loadBudgetPeriods();
    }

    handleNew() {
        this.isNew = true;
    }

    handleBudgetPeriodCreated() {
        this.isNew = false;
        this.pageNumber = 1;
        this.loadBudgetPeriods();
        fireEvent(this.pageRef, 'budgetPeriodAdded', {});
    }

    handleBudgetPeriodCancel() {
        this.isNew = false;
    }
}