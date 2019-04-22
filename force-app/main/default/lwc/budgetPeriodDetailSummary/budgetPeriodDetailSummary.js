import { LightningElement, api } from 'lwc';

export default class BudgetPeriodDetailSummary extends LightningElement {
    @api totalIncome;
    @api totalExpenses;
    @api totalSavings;

    allValuesPopulated() {
        return this.totalIncome && this.totalExpenses && this.totalSavings;
    }
}