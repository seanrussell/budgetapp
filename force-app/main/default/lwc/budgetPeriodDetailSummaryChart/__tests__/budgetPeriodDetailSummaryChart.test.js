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

        element.summary = {
            "Total_Income__c": 1200.0,
            "Total_Expense__c": 1000.0,
            "Total_Savings__c": 200.0
        };

        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                const chartElem = element.shadowRoot.querySelector(
                    '.doughnut'
                );

                expect(chartElem).toBeTruthy();
            });
    });
});