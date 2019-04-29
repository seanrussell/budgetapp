import { createElement } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import BudgetPeriodListContainer from 'c/budgetPeriodListContainer';
import { registerTestWireAdapter, registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import getBudgetPeriods from '@salesforce/apex/BudgetPeriodController.getBudgetPeriods';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

registerTestWireAdapter(CurrentPageReference);

const mockBudgetPeriodListContainer = require('./data/budgetPeriodListContainer.json');
const retrieveBudgetPeriodListContainerAdapter = registerApexTestWireAdapter(getBudgetPeriods);

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn(),
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    };
});

describe('c-budget-period-list-container', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    it('initial component creation', () => {
        const element = createElement('c-budget-period-list-container', {
            is: BudgetPeriodListContainer
        });
        document.body.appendChild(element);

        retrieveBudgetPeriodListContainerAdapter.emit(mockBudgetPeriodListContainer);

        return Promise.resolve()
            .then(() => {
                // Validate if pubsub got registered after connected to the DOM
                expect(registerListener.mock.calls.length).toBe(1);
                expect(registerListener.mock.calls[0][0]).toBe('budgetPeriodDeleted');

                document.body.removeChild(element);
                expect(unregisterAllListeners.mock.calls.length).toBe(1);
            });
    });
});