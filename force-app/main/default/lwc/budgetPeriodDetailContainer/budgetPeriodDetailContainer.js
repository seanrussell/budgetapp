/* Base Lightning */
import { LightningElement, track, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/* Pubsub */
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

/* Apex methods */
import deleteBudgetPeriod from '@salesforce/apex/BudgetPeriodController.deleteBudgetPeriod';
import retrieveBudgetPeriodDetail from '@salesforce/apex/BudgetPeriodController.retrieveBudgetPeriodDetail';
import retrieveBudgetPeriodDetailUpdate from '@salesforce/apex/BudgetPeriodController.retrieveBudgetPeriodDetailUpdate';

/* Objects and fields */
import BUDGET_PERIOD_OBJECT from '@salesforce/schema/Budget_Period__c';
import NAME_FIELD from '@salesforce/schema/Budget_Period__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Budget_Period__c.Description__c';
import START_DATE_FIELD from '@salesforce/schema/Budget_Period__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Budget_Period__c.End_Date__c';

export default class BudgetPeriodDetailContainer extends LightningElement {
    budgetPeriodObject = BUDGET_PERIOD_OBJECT;
    budgetPeriodFields = [NAME_FIELD, DESCRIPTION_FIELD, START_DATE_FIELD, END_DATE_FIELD];

    @track recordId;
    @track period = {};
    @track error;
    @track success = false;
    initialized = false;

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('periodSelected', this.handlePeriodSelected, this);
        registerListener('budgetPeriodListDelete', this.handlePeriodListDelete, this);
        registerListener('transactionItemAdded', this.handleTransactionItemChangeEvent, this);
        registerListener('transactionItemDeleted', this.handleTransactionItemChangeEvent, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    renderedCallback() {
        if (this.recordId && !this.initialized) {
            this.initialized = true;
            this.retrieveBudgetPeriodDetail();
        }
    }

    allValuesPopulated() {
        return this.period.Total_Income__c && this.period.Total_Expense__c && this.period.Total_Savings__c;
    }

    retrieveBudgetPeriodDetail() {
        retrieveBudgetPeriodDetail({budgetPeriodId: this.recordId})
                .then(result => {
                    this.period.data = result;
                })
                .catch(error => {
                    this.error = error;
                });
    }

    handlePeriodSelected(periodId) {
        this.period = {};
        this.recordId = periodId;
        this.retrieveBudgetPeriodDetail();
    }

    handlePeriodListDelete() {
        this.period = {};
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

    handleTransactionItemChangeEvent() {
        retrieveBudgetPeriodDetailUpdate({budgetPeriodId: this.recordId})
            .then(result => {
                this.period.data = result;
            })
            .catch(error => {
                this.error = error;
            });
    }
}