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
    }

    @isTest
    static void testGetBudgetPeriods() {

        Test.startTest();
        PagedResult result = BudgetPeriodController.getBudgetPeriods(1);
        Test.stopTest();

        System.assertEquals(3, result.totalItemCount);
        System.assertEquals(3, result.records.size());
    }
}
