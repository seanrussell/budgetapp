/* Base Lightning */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

/* Pubsub */
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

/* Apex methods */
import getBudgetPeriods from '@salesforce/apex/BudgetPeriodController.getBudgetPeriods';

/* Objects and fields */
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

    @wire(getBudgetPeriods, {pageNumber: '$pageNumber' })
    periods;

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

    handleBudgetPeriodDeleted() {
        refreshApex(this.pageNumber);
        fireEvent(this.pageRef, 'budgetPeriodRemoved', {});
        fireEvent(this.pageRef, 'budgetPeriodListDelete', {});
    }

    handlePeriodSelected(event) {
        fireEvent(this.pageRef, 'periodSelected', event.detail);
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
        refreshApex(this.pageNumber);
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
        refreshApex(this.pageNumber);
    }

    handleNew() {
        this.isNew = true;
    }

    handleBudgetPeriodCreated() {
        this.isNew = false;
        this.pageNumber = 1;
        refreshApex(this.pageNumber);
        fireEvent(this.pageRef, 'budgetPeriodAdded', {});
    }

    handleBudgetPeriodCancel() {
        this.isNew = false;
    }
}