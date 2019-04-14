import { LightningElement, api } from 'lwc';

export default class BudgetPeriodListItem extends LightningElement {
    @api period;

    handleClick(event) {
        event.preventDefault();
        const selectedEvent = new CustomEvent('selected', {
            detail: this.period.Id
        });
        this.dispatchEvent(selectedEvent);
    }
}