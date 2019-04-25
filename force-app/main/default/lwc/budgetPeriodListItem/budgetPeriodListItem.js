/* Base Lightning */
import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/* Apex methods */
import deleteBudgetPeriod from '@salesforce/apex/BudgetPeriodController.deleteBudgetPeriod';

export default class BudgetPeriodListItem extends LightningElement {
    @api period;
    @track actions = [
        { label: 'Edit', value: 'edit', iconName: 'utility:edit' },
        { label: 'Delete', value: 'delete', iconName: 'utility:delete' },
    ];

    handleAction(event) {
        const tileAction = event.detail.action.value;

        if (tileAction === 'delete') {
            this.deleteBudgetPeriodItem();
        } else {
            const selectedEvent = new CustomEvent('selected', {
                detail: this.period.Id
            });
            this.dispatchEvent(selectedEvent);
        }
    }

    deleteBudgetPeriodItem() {
        if (this.period && this.period.Id) {
            deleteBudgetPeriod({budgetPeriodId: this.period.Id})
                .then(result => {
                    this.period = {};
                    
                    const event = new ShowToastEvent({
                        title: 'Delete',
                        message: 'Budget period was deleted successfully',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);

                    const selectedEvent = new CustomEvent('deleted', {
                        detail: this.period.Id
                    });
                    this.dispatchEvent(selectedEvent);
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

    handleClick(event) {
        event.preventDefault();
        /*
        const selectedEvent = new CustomEvent('selected', {
            detail: this.period.Id
        });
        this.dispatchEvent(selectedEvent);
        */
    }
}