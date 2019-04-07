@isTest
private class TransactionItemControllerTest {
    
    @TestSetup
    static void setup() {
        Budget_Period__c budgetPeriod = new Budget_Period__c(
            Name = 'January 2019',
            Start_Date__c = Date.newInstance(2019, 1, 1),
            End_Date__c = Date.newInstance(2019, 1, 31)
        );

        insert budgetPeriod;

        List<Transaction_Item__c> transactionItems = new List<Transaction_Item__c>{
            new Transaction_Item__c(
                Budget_Period__c = budgetPeriod.Id,
                Name = 'Job paycheck',
                Amount__c = 1000.0,
                Type__c = 'Credit',
                Date__c = Date.newInstance(2019, 1, 15)
            ),
            new Transaction_Item__c(
                Budget_Period__c = budgetPeriod.Id,
                Name = 'Mortgage payment',
                Amount__c = 900.0,
                Type__c = 'Debit',
                Date__c = Date.newInstance(2019, 1, 20)
            )
        };

        insert transactionItems;
    }

    static Budget_Period__c getBudgetPeriod() {
        return [
            SELECT 
                Id 
            FROM 
                Budget_Period__c
            LIMIT 1
        ];
    }

    @isTest
    static void testGetTransactionItems() {
        Budget_Period__c budgetPeriod = getBudgetPeriod();

        Test.startTest();
        Transaction_Item__c[] transactionItems = TransactionItemController.getTransactionItems(budgetPeriod.Id);
        Test.stopTest();

        System.assertEquals(2, transactionItems.size());
    }
}
