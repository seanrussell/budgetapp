import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getBudgetPeriods from '@salesforce/apex/BudgetPeriodController.getBudgetPeriods';

import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class BudgetPeriodList extends LightningElement {
    
    @track periods = [];

    @track totalItemCount = 0;

    @wire(CurrentPageReference) pageRef;

    @wire(getBudgetPeriods, { pageNumber: '$pageNumber' })
    periods;

    handlePeriodSelected(event) {
        fireEvent(this.pageRef, 'periodSelected', event.detail);
    }
}