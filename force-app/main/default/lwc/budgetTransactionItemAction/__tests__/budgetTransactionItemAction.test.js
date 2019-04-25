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
    });
});