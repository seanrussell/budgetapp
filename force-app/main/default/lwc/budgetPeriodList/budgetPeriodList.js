import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getBudgetPeriods from '@salesforce/apex/BudgetPeriodController.getBudgetPeriods';

import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class BudgetPeriodList extends LightningElement {
    @api pageNumber = 1;
    
    @track periods = [];

    @track error = [];
    
    @track totalItemCount = 0;

    @wire(CurrentPageReference) pageRef;

    @wire(getBudgetPeriods, { pageNumber: '$pageNumber' })
    periods;

    handlePeriodSelected(event) {
        console.log('HANDLE PERIOD SELECTED EVENT');
        fireEvent(this.pageRef, 'periodSelected', event.detail);
    }
}