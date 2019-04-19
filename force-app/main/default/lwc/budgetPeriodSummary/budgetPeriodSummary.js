import { LightningElement, api, track } from 'lwc';

export default class BudgetPeriodSummary extends LightningElement {
    @api summary;

    @track error;
    @track totalIncome;
    @track totalExpenses;
    @track totalSavings;

    renderedCallback() {
        if (this.summary) {
            this.totalIncome = this.summary.totalIncome;
            this.totalExpenses = this.summary.totalExpense;
            this.totalSavings = this.summary.totalSavings;
        }
    }
}