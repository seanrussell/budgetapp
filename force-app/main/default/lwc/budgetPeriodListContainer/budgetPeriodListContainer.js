import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class BudgetPeriodListContainer extends LightningElement {
    
    @api utilityBarIsVisible = false;

    @track isNew = false;

    @track pageNumber = 1;

    @track pageSize;

    @track totalItemCount = 0;

    @wire(CurrentPageReference) pageRef;

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

    handlePeriodSelect(event) {

    }
}