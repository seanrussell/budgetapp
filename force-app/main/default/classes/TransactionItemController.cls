public with sharing class TransactionItemController {

    @AuraEnabled
    public static List<Transaction_Item__c> getTransactionItems(String budgetPeriodId) {
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
            ORDER BY Date__c
        ];
        
        return items;
    }

    @AuraEnabled
    public static void deleteTransactionItem(String transactionItemId) {
        if (String.isNotBlank(transactionItemId)) {
            try {
                delete [SELECT Id FROM Transaction_Item__c WHERE Id = :transactionItemId];
            } catch (Exception e) {
                throw new AuraException(e.getMessage());
            }
        }
    }
}