import { LightningElement, api } from 'lwc';

export default class BudgetTransactionItemAction extends LightningElement {
    @api name;
    @api label;
    @api transactionItem;

    handleClick(event) {
        console.log('HANDLING CLICK EVENT');
        if (this.name == 'action:edit') {
            console.log('IS EDIT');
            const editEvent = new CustomEvent('edit', {
                detail: this.transactionItem.Id
            });
            this.dispatchEvent(editEvent);
        } else {
            console.log('IS DELETE');
            const deleteEvent = new CustomEvent('delete', {
                detail: this.transactionItem.Id
            });
            this.dispatchEvent(deleteEvent);
        }
    }
}