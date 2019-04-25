import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodListItem from 'c/budgetPeriodListItem';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-period-list-item', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-period-list-item', {
            is: BudgetPeriodListItem
        });
        document.body.appendChild(element);
    });
});