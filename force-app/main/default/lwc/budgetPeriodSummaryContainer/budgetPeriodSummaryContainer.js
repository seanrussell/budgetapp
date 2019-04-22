import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import getBudgetPeriodSummary from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodSummary';
import getBudgetPeriodSummaryUpdate from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodSummaryUpdate';
import getBudgetPeriodHistory from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodRecentHistory';
import getBudgetPeriodHistoryUpdate from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodRecentHistoryUpdate';

export default class BudgetPeriodSummaryContainer extends LightningElement {
    @track error;

    @track
    summary = {};

    @track
    history = {};

    loaded = false;

    @wire(CurrentPageReference) pageRef;

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
            this.loadSummaryData();
        }
    }

    loadSummaryData() {
        this.loadBudgetPeriodSummary();
        this.loadBudgetPeriodHistory();
    }

    loadSummaryDataUpdate() {
        this.loadBudgetPeriodSummaryUpdate();
        this.loadBudgetPeriodHistoryUpdate();
    }

    loadBudgetPeriodSummary() {
        getBudgetPeriodSummary()
            .then(result => {
                this.summary.data = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    loadBudgetPeriodSummaryUpdate() {
        getBudgetPeriodSummaryUpdate()
            .then(result => {
                this.summary.data = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    loadBudgetPeriodHistory() {
        getBudgetPeriodHistory()
            .then(result => {
                this.history.data = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    loadBudgetPeriodHistoryUpdate() {
        getBudgetPeriodHistoryUpdate()
            .then(result => {
                this.history.data = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleEvent() {
        this.loadSummaryDataUpdate();
    }
}