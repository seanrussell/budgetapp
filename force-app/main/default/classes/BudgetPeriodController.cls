public with sharing class BudgetPeriodController {

    static Integer PAGE_SIZE = 9;

    @AuraEnabled(Cacheable=true)
    public static PagedResult getBudgetPeriods(Integer pageNumber) {
        Integer pageSize = BudgetPeriodController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;

        PagedResult result = new PagedResult();

        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery('SELECT count() FROM Budget_Period__c');
        result.records = Database.query('SELECT Id, Name, Description__c, Start_Date__c, End_Date__c, Total_Income__c, Total_Expense__c, Total_Saving__c FROM Budget_Period__c  ORDER BY Name LIMIT :pageSize OFFSET :offset');
        
        return result;
    }
}