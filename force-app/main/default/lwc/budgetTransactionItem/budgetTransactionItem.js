import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getTransactionItemList from '@salesforce/apex/TransactionItemController.getTransactionItems';
import deleteTransactionItem from '@salesforce/apex/TransactionItemController.deleteTransactionItem';

import TRANSACTION_ITEM_OBJECT from '@salesforce/schema/Transaction_Item__c';
import BUDGET_PERIOD_ID_FIELD from '@salesforce/schema/Transaction_Item__c.Budget_Period__c';
import NAME_FIELD from '@salesforce/schema/Transaction_Item__c.Name';
import TYPE_FIELD from '@salesforce/schema/Transaction_Item__c.Type__c';
import AMOUNT_FIELD from '@salesforce/schema/Transaction_Item__c.Amount__c';
import DATE_FIELD from '@salesforce/schema/Transaction_Item__c.Date__c';


export default class BudgetTransactionItemContainer extends LightningElement {
    @api budgetPeriodId;

    transactionItemObject = TRANSACTION_ITEM_OBJECT;
    transactionItemFields = [BUDGET_PERIOD_ID_FIELD, NAME_FIELD, TYPE_FIELD, AMOUNT_FIELD, DATE_FIELD];

    @track items = [];
    @track isNew = false;
    @track isEdit = false;
    @track error = {};
    @track selectedId;

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
    }

    handleTransactionItemCancel() {
        this.isEdit = false;
    }
}