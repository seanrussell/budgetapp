public with sharing class TransactionItemController {

    @AuraEnabled(Cacheable=true)
    public static Transaction_Item__c[] getTransactionItems(Id budgetPeriodId) {
        return [
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
    }
}