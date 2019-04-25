import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodDetailSummaryChart from 'c/budgetPeriodDetailSummaryChart';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-period-detail-summary-chart', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-period-detail-summary-chart', {
            is: BudgetPeriodDetailSummaryChart
        });
        document.body.appendChild(element);
    });
});