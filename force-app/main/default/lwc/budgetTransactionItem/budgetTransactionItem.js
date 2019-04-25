/* Base Lightning */
import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/* Pubsub */
import { fireEvent } from 'c/pubsub';

/* Apex methods */
import getTransactionItemList from '@salesforce/apex/TransactionItemController.getTransactionItems';
import deleteTransactionItem from '@salesforce/apex/TransactionItemController.deleteTransactionItem';

/* Objects and fields */
import TRANSACTION_ITEM_OBJECT from '@salesforce/schema/Transaction_Item__c';
import BUDGET_PERIOD_ID_FIELD from '@salesforce/schema/Transaction_Item__c.Budget_Period__c';
import NAME_FIELD from '@salesforce/schema/Transaction_Item__c.Name';
import TYPE_FIELD from '@salesforce/schema/Transaction_Item__c.Type__c';
import AMOUNT_FIELD from '@salesforce/schema/Transaction_Item__c.Amount__c';
import DATE_FIELD from '@salesforce/schema/Transaction_Item__c.Date__c';

export default class BudgetTransactionItemContainer extends LightningElement {
    transactionItemObject = TRANSACTION_ITEM_OBJECT;
    transactionItemFields = [BUDGET_PERIOD_ID_FIELD, NAME_FIELD, TYPE_FIELD, AMOUNT_FIELD, DATE_FIELD];

    @api budgetPeriodId;

    @track items = [];
    @track isNew = false;
    @track isEdit = false;
    @track error = {};
    @track selectedId;

    @wire(CurrentPageReference) pageRef;

    renderedCallback() {
        if (this.budgetPeriodId) {
            this.loadTransactionItems();
        }
    }

    loadTransactionItems() {
        getTransactionItemList({budgetPeriodId: this.budgetPeriodId})
            .then(result => {
                this.items = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleNew() {
        this.isEdit = true;
        this.isNew = true;
    }

    handleCancel() {
        this.isEdit = false;
        this.isNew = false;
    }

    handleEditAction(event) {
        this.selectedId = event.detail;
        this.isEdit = true;
        this.isNew = false;
    }

    handleDeleteAction(event) {
        if (event.detail) {
            deleteTransactionItem({transactionItemId: event.detail})
                .then(result => {
                    const event = new ShowToastEvent({
                        title: 'Delete',
                        message: 'Transaction Item was deleted successfully',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);

                    this.loadTransactionItems();

                    fireEvent(this.pageRef, 'transactionItemDeleted', {});
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Delete',
                        message: 'Transaction Item unable to be deleted',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);

                    this.error = error;
                });
        }
    }

    handleTransactionItemCreated() {
        this.isEdit = false;
        this.loadTransactionItems();
        fireEvent(this.pageRef, 'transactionItemAdded', {});
    }

    handleTransactionItemCancel() {
        this.isEdit = false;
    }

    isTypeCredit(theType) {
        return theType === 'Credit';
    }
}