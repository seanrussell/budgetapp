public with sharing class BudgetPeriodController {

    static Integer PAGE_SIZE = 9;

    static final Map<Integer, String> MONTH_NAMES = new Map<Integer, String>{
        1 => 'January',
        2 => 'February',
        3 => 'March',
        4 => 'April',
        5 => 'May',
        6 => 'June',
        7 => 'July',
        8 => 'August',
        9 => 'September',
        10 => 'October',
        11 => 'November',
        12 => 'December'
    };

    @AuraEnabled
    public static PagedResult getBudgetPeriods(Integer pageNumber) {
        Integer pageSize = BudgetPeriodController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;

        PagedResult result = new PagedResult();

        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery('SELECT count() FROM Budget_Period__c');
        result.records = Database.query('SELECT Id, Name, Description__c, Start_Date__c, End_Date__c  FROM Budget_Period__c  ORDER BY Start_Date__c DESC LIMIT :pageSize OFFSET :offset');
        
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static BudgetPeriodSummary getBudgetPeriodSummary() {
        return retrieveBudgetPeriodSummary();
    }

    @AuraEnabled
    public static BudgetPeriodSummary getBudgetPeriodSummaryUpdate() {
        return retrieveBudgetPeriodSummary();
    }

    private static BudgetPeriodSummary retrieveBudgetPeriodSummary() {
        AggregateResult[] results = [
            SELECT 
                SUM(Total_Income__c) totalIncome, 
                SUM(Total_Expense__c) totalExpense, 
                SUM(Total_Savings__c) totalSavings 
            FROM Budget_Period__c
        ];

        BudgetPeriodSummary summary = new BudgetPeriodSummary();

        if (!results.isEmpty()) {
            summary.totalIncome = (Decimal)results.get(0).get('totalIncome');
            summary.totalExpense = (Decimal)results.get(0).get('totalExpense');
            summary.totalSavings = (Decimal)results.get(0).get('totalSavings');
        }

        return summary;
    }

    @AuraEnabled(cacheable=true)
    public static List<BudgetPeriod> getBudgetPeriodRecentHistory() {
        return retrieveBudgetPeriodHistory();
    }

    @AuraEnabled
    public static List<BudgetPeriod> getBudgetPeriodRecentHistoryUpdate() {
        return retrieveBudgetPeriodHistory();
    }

    private static List<BudgetPeriod> retrieveBudgetPeriodHistory() {
        List<Budget_Period__c> budgetPeriods = [
            SELECT 
                Start_Date__c,
                Total_Income__c,
                Total_Expense__c,
                Total_Savings__c
            FROM
                Budget_Period__c
            ORDER BY 
                Start_Date__c DESC
            LIMIT 3
        ];

        List<BudgetPeriod> bps = new List<BudgetPeriod>();

        for (Integer i = budgetPeriods.size() - 1; i >= 0; i--) {
            Budget_Period__c budgetPeriod = budgetPeriods.get(i);

            bps.add(
                new BudgetPeriod(
                    getLabel(budgetPeriod.Start_Date__c),
                    budgetPeriod.Total_Income__c,
                    budgetPeriod.Total_Expense__c,
                    budgetPeriod.Total_Savings__c
                )
            );
        }      
      
        return bps;
    }

    @AuraEnabled
    public static void deleteBudgetPeriod(String budgetPeriodId) {
        if (String.isNotBlank(budgetPeriodId)) {
            try {
                delete [SELECT Id FROM Budget_Period__c WHERE Id = :budgetPeriodId];
            } catch (Exception e) {
                throw new AuraException(e.getMessage());
            }
        } 
    }

    private static String getLabel(Date theDate) {
        return MONTH_NAMES.get(theDate.month()) + ' ' + theDate.year();
    }

    public class BudgetPeriod {
        @AuraEnabled
        public String label { get; set; }

        @AuraEnabled
        public Decimal income { get; set; }

        @AuraEnabled
        public Decimal expense { get; set; }

        @AuraEnabled
        public Decimal savings { get; set; }

        public BudgetPeriod(String label, Decimal income, Decimal expense, Decimal savings) {
            this.label = label;
            this.income = income;
            this.expense = expense;
            this.savings = savings;
        }
    }

    public class BudgetPeriodSummary {
        @AuraEnabled
        public Decimal totalIncome { get; set; }

        @AuraEnabled
        public Decimal totalExpense { get; set; }

        @AuraEnabled
        public Decimal totalSavings { get; set; }
    }
}