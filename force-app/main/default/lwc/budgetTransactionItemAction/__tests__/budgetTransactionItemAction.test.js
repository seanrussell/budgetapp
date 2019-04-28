import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetTransactionItemAction from 'c/budgetTransactionItemAction';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-transaction-item-action', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-transaction-item-action', {
            is: BudgetTransactionItemAction
        });
        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                const btn = element.shadowRoot.querySelector(
                    'lightning-button-icon'
                );

                expect(btn).toBeTruthy();
            });
    });

    it('fires edit event when clicked', () => {
        const listener = jest.fn();

        const element = createElement('c-budget-transaction-item-action', {
            is: BudgetTransactionItemAction
        });

        element.addEventListener('selected', listener);
        element.name = 'action:edit';

        document.body.appendChild(element);

        const btn = element.shadowRoot.querySelector('lightning-button-icon');
        btn.click();

        expect(listener).toHaveBeenCalled();
    });

    it('fires edit event when clicked', () => {
        const listener = jest.fn();
        
        const element = createElement('c-budget-transaction-item-action', {
            is: BudgetTransactionItemAction
        });

        element.addEventListener('selected', listener);
        element.name = 'action:delete';

        document.body.appendChild(element);

        const btn = element.shadowRoot.querySelector('lightning-button-icon');
        btn.click();

        expect(listener).toHaveBeenCalled();
    });
});