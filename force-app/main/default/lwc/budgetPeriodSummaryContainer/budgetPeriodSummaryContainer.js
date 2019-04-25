/* Base Lightning */
import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

/* Pubsub */
import { registerListener, unregisterAllListeners } from 'c/pubsub';

/* Apex methods */
import getBudgetPeriodSummary from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodSummary';
import getBudgetPeriodHistory from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodRecentHistory';

export default class BudgetPeriodSummaryContainer extends LightningElement {
    @track error;

    @track
    summary = {};

    @track
    history = {};

    loaded = false;

    @wire(CurrentPageReference) pageRef;

    @wire(getBudgetPeriodSummary)
    summary;

    @wire(getBudgetPeriodHistory)
    history;

    connectedCallback() {
        registerListener('budgetPeriodAdded', this.handleEvent, this);
        registerListener('budgetPeriodRemoved', this.handleEvent, this);
        registerListener('transactionItemAdded', this.handleEvent, this);
        registerListener('transactionItemDeleted', this.handleEvent, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    renderedCallback() {
        if (!this.loaded) {
            this.loaded = true;
        }
    }
    
    loadSummaryDataUpdate() {
        refreshApex(this.summary);
        refreshApex(this.history);
    }

    handleEvent() {
        this.loadSummaryDataUpdate();
    }
}