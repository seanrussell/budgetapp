import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getBudgetPeriods from '@salesforce/apex/BudgetPeriodController.getBudgetPeriods';

import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

/**
 * Container component that loads and displays a list of Product__c records.
 */
export default class BudgetPeriodListContainer extends LightningElement {
    
    @api utilityBarIsVisible = false;

    @track periods = [];

    @track pageNumber = 1;

    @track pageSize;

    @track totalItemCount = 0;

    @wire(CurrentPageReference) pageRef;

    @wire(getBudgetPeriods, { pageNumber: '$pageNumber' })
    periods;

    handlePeriodSelected(event) {
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
}