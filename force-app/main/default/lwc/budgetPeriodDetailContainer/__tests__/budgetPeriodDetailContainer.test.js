import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodDetailContainer from 'c/budgetPeriodDetailContainer';

import { registerTestWireAdapter, registerApexTestWireAdapter } from '@salesforce/lwc-jest';

import { registerListener, unregisterAllListeners } from 'c/pubsub';
import retrieveBudgetPeriodDetail from '@salesforce/apex/BudgetPeriodController.retrieveBudgetPeriodDetail';

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn(),
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    };
});

const mockBudgetPeriodDetail = require('./data/budgetPeriodDetail.json');
const retrieveBudgetPeriodDetailAdapter = registerApexTestWireAdapter(retrieveBudgetPeriodDetail);

registerTestWireAdapter(CurrentPageReference);

describe('c-budget-period-detail-container', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    it('registers and unregisters the pubsub listener during the component lifecycle', () => {
        const element = createElement('c-budget-period-detail-container', {
            is: BudgetPeriodDetailContainer
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(registerListener.mock.calls.length).toBe(4);
        expect(registerListener.mock.calls[0][0]).toBe('periodSelected');
        expect(registerListener.mock.calls[1][0]).toBe('budgetPeriodListDelete');
        expect(registerListener.mock.calls[2][0]).toBe('transactionItemAdded');
        expect(registerListener.mock.calls[3][0]).toBe('transactionItemDeleted');

        // Validate if pubsub got unregistered after disconnected from the DOM
        document.body.removeChild(element);
        expect(unregisterAllListeners.mock.calls.length).toBe(1);
    });

    it('retrieves budget period record', () => {
        const element = createElement('c-budget-period-detail-container', {
            is: BudgetPeriodDetailContainer
        });
        document.body.appendChild(element);

        retrieveBudgetPeriodDetailAdapter.emit(mockBudgetPeriodDetail);

        return Promise.resolve()
            .then(() => {
                const delButton = element.shadowRoot.querySelector(
                    'lightning-button'
                );

                expect(delButton).toBeTruthy();
            })
            .then(() => {
                const summaryComponent = element.shadowRoot.querySelector(
                    'c-budget-period-detail-summary'
                );

                expect(summaryComponent).toBeTruthy();
            })
            .then(() => {
                const summaryChartComponent = element.shadowRoot.querySelector(
                    'c-budget-period-detail-summary-chart'
                );

                expect(summaryChartComponent).toBeTruthy();
            });
    });
});