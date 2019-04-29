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

        return Promise.resolve()
            .then(() => {
                const btns = element.shadowRoot.querySelectorAll(
                    'lightning-button-icon'
                );

                expect(btns.length).toBe(1);
            });
    });

    it('fires edit event when clicked', () => {
        const element = createElement('c-budget-transaction-item-action', {
            is: BudgetTransactionItemAction
        });

        element.name = 'action:edit';
        element.transactionItem = {
            "Id": '1234',
            "Name": "Bonus payment",
            "Date__c": "2019-03-31",
            "Type__c": "Credit",
            "Amount__c": 500.0
        };

        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener("edit", handler);

        const btn = element.shadowRoot.querySelector('lightning-button-icon');
        btn.click();

        return Promise.resolve().then(() => {
            expect(handler).toHaveBeenCalled();
        });
    });

    it('fires delete event when clicked', () => {
        const element = createElement('c-budget-transaction-item-action', {
            is: BudgetTransactionItemAction
        });

        element.name = 'action:delete';
        element.transactionItem = {
            "Id": '1234',
            "Name": "Bonus payment",
            "Date__c": "2019-03-31",
            "Type__c": "Credit",
            "Amount__c": 500.0
        };

        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener("delete", handler);

        const btn = element.shadowRoot.querySelector('lightning-button-icon');
        btn.click();

        return Promise.resolve().then(() => {
            expect(handler).toHaveBeenCalled();
        });
    });
});