import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodSummary from 'c/budgetPeriodSummary';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-period-summary', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-period-summary', {
            is: BudgetPeriodSummary
        });
        document.body.appendChild(element);
    });
});