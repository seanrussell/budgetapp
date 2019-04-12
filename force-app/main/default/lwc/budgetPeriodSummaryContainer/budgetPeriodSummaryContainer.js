import { LightningElement, wire, track } from 'lwc';
import getBudgetPeriodSummary from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodSummary';
import getBudgetPeriodHistory from '@salesforce/apex/BudgetPeriodController.getBudgetPeriodRecentHistory';

export default class BudgetPeriodSummaryContainer extends LightningElement {
    @track
    summary = {};
    
    @wire(getBudgetPeriodSummary)
    summary;

    @track
    history = {};
    
    @wire(getBudgetPeriodHistory)
    history;
}