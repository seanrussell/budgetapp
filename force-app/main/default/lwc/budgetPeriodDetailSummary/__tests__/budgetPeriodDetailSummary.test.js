import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodDetailSummary from 'c/budgetPeriodDetailSummary';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-period-detail-summary', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-period-detail-summary', {
            is: BudgetPeriodDetailSummary
        });
        document.body.appendChild(element);
    });
});