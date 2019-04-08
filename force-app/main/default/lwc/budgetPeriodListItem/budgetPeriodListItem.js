import { LightningElement, api } from 'lwc';

export default class ContactListItemBubbling extends LightningElement {
    @api period;

    handleSelect(event) {
        event.preventDefault();
        const selectEvent = new CustomEvent('periodselect', {
            bubbles: true
        });
        
        this.dispatchEvent(selectEvent);
    }
}