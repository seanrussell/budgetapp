/* Base Lightning */
import { LightningElement, api } from 'lwc';

export default class BudgetTransactionItemAction extends LightningElement {
    @api name;
    @api label;
    @api transactionItem;

    handleClick(event) {
        if (this.name === 'action:edit') {
            const editEvent = new CustomEvent('edit', {
                detail: this.transactionItem.Id
            });
            this.dispatchEvent(editEvent);
        } else {
            const deleteEvent = new CustomEvent('delete', {
                detail: this.transactionItem.Id
            });
            this.dispatchEvent(deleteEvent);
        }
    }
}