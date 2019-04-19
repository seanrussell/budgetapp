import { LightningElement, api, track, wire } from 'lwc';

import getTransactionItemList from '@salesforce/apex/TransactionItemController.getTransactionItems';

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
            getTransactionItemList({budgetPeriodId: this.budgetPeriodId})
                .then(result => {
                    this.items = result;
                })
                .catch(error => {
                    this.error = error;
                });
        }
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
        console.log('EVT: ', event.detail);
        this.selectedId = event.detail;
        this.isEdit = true;
        this.isNew = false;
    }

    handleDeleteAction(event) {
        console.log('EVT: ', event.detail);
    }

    handleTransactionItemCreated() {
        this.isEdit = false;
    }

    handleTransactionItemCancel() {
        this.isEdit = false;
    }
}