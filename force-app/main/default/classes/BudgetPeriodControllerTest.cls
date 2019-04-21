@isTest
private class BudgetPeriodControllerTest {
    
    @TestSetup
    static void setup() {
        List<Budget_Period__c> budgetPeriods = new List<Budget_Period__c>{
            new Budget_Period__c(
                Name = 'January 2019',
                Start_Date__c = Date.newInstance(2019, 1, 1),
                End_Date__c = Date.newInstance(2019, 1, 31)
            ),
            new Budget_Period__c(
                Name = 'February 2019',
                Start_Date__c = Date.newInstance(2019, 2, 1),
                End_Date__c = Date.newInstance(2019, 2, 28)
            ),
            new Budget_Period__c(
                Name = 'March 2019',
                Start_Date__c = Date.newInstance(2019, 3, 1),
                End_Date__c = Date.newInstance(2019, 3, 31)
            )
        };

        insert budgetPeriods;

        List<Transaction_Item__c> transactionItems = new List<Transaction_Item__c>{
            new Transaction_Item__c(
                Budget_Period__c = budgetPeriods.get(0).Id,
                Name = 'Job paycheck',
                Amount__c = 1000.0,
                Type__c = 'Credit',
                Date__c = Date.newInstance(2019, 1, 15)
            ),
            new Transaction_Item__c(
                Budget_Period__c = budgetPeriods.get(0).Id,
                Name = 'Mortgage payment',
                Amount__c = 900.0,
                Type__c = 'Debit',
                Date__c = Date.newInstance(2019, 1, 20)
            )
        };

        insert transactionItems;
    }

    static List<Budget_Period__c> getBudgetPeriods() {
        return [
            SELECT
                Id 
            FROM 
                Budget_Period__c
        ];
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
    static void testGetBudgetPeriods() {

        Test.startTest();
        PagedResult result = BudgetPeriodController.getBudgetPeriods(1);
        Test.stopTest();

        System.assertEquals(3, result.totalItemCount);
        System.assertEquals(3, result.records.size());
    }

    @isTest 
    static void testGetBudgetPeriodSummary() {

        Test.startTest();
        BudgetPeriodController.BudgetPeriodSummary summary = BudgetPeriodController.getBudgetPeriodSummary();
        Test.stopTest();

        System.assertEquals(1000, summary.totalIncome);
        System.assertEquals(900, summary.totalExpense);
        System.assertEquals(100, summary.totalSavings);
    }

    @isTest 
    static void testGetBudgetPeriodSummaryUpdate() {

        Test.startTest();
        BudgetPeriodController.BudgetPeriodSummary summary = BudgetPeriodController.getBudgetPeriodSummaryUpdate();
        Test.stopTest();

        System.assertEquals(1000, summary.totalIncome);
        System.assertEquals(900, summary.totalExpense);
        System.assertEquals(100, summary.totalSavings);
    }

    @isTest 
    static void testGetBudgetPeriodRecentHistory() {

        Test.startTest();
        List<BudgetPeriodController.BudgetPeriod> recentHistory = BudgetPeriodController.getBudgetPeriodRecentHistory();
        Test.stopTest();

        System.assert(!recentHistory.isEmpty());
    }

    @isTest 
    static void testGetBudgetPeriodRecentHistoryUpdate() {

        Test.startTest();
        List<BudgetPeriodController.BudgetPeriod> recentHistory = BudgetPeriodController.getBudgetPeriodRecentHistoryUpdate();
        Test.stopTest();

        System.assert(!recentHistory.isEmpty());
    }

    @isTest 
    static void testDeleteBudgetPeriod() {
        Budget_Period__c budgetPeriod = getBudgetPeriod();
        List<Budget_Period__c> budgetPeriods = getBudgetPeriods();

        Test.startTest();
        BudgetPeriodController.deleteBudgetPeriod(budgetPeriod.Id);
        Test.stopTest();

        List<Budget_Period__c> updatedBudgetPeriods = getBudgetPeriods();

        System.assertEquals(budgetPeriods.size(), updatedBudgetPeriods.size() + 1);
    }
}
