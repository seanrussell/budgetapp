import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodSummaryContainer from 'c/budgetPeriodSummaryContainer';
import { registerTestWireAdapter, registerApexTestWireAdapter } from '@salesforce/lwc-jest';

import { registerListener, unregisterAllListeners } from 'c/pubsub';

import getBudgetPeriodSummary from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodSummary';
import getBudgetPeriodHistory from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodRecentHistory';

const getBudgetPeriodSummaryAdapter = registerApexTestWireAdapter(getBudgetPeriodSummary);
const getBudgetPeriodHistoryAdapter = registerApexTestWireAdapter(getBudgetPeriodHistory);

registerTestWireAdapter(CurrentPageReference);

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    };
});

describe('c-budget-period-summary-container', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-period-summary-container', {
            is: BudgetPeriodSummaryContainer
        });
        document.body.appendChild(element);

         // Validate if pubsub got registered after connected to the DOM
         expect(registerListener.mock.calls.length).toBe(4);
         expect(registerListener.mock.calls[0][0]).toBe('budgetPeriodAdded');
         expect(registerListener.mock.calls[1][0]).toBe('budgetPeriodRemoved');
         expect(registerListener.mock.calls[2][0]).toBe('transactionItemAdded');
         expect(registerListener.mock.calls[3][0]).toBe('transactionItemDeleted');
 
         // Validate if pubsub got unregistered after disconnected from the DOM
         document.body.removeChild(element);
         expect(unregisterAllListeners.mock.calls.length).toBe(1);
    });
});