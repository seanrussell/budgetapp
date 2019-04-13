public with sharing class TransactionItemController {

    @AuraEnabled
    public static List<Transaction_Item__c> getTransactionItems(String budgetPeriodId) {
        System.debug(LoggingLevel.WARN, 'BUDGET PERIOD ID: ' + budgetPeriodId);
        List<Transaction_Item__c> items = [
            SELECT 
                Id,
                Name, 
                Amount__c,
                Date__c,
                Type__c
            FROM 
                Transaction_Item__c 
            WHERE 
                Budget_Period__c = :budgetPeriodId
        ];
        System.debug(LoggingLevel.WARN, 'ITEMS: ' + items);
        return items;
    }
}