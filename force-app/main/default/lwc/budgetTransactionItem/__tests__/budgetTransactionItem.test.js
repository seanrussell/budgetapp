import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetTransactionItem from 'c/budgetTransactionItem';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-transaction-item', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-transaction-item', {
            is: BudgetTransactionItem
        });
        document.body.appendChild(element);
    });
});