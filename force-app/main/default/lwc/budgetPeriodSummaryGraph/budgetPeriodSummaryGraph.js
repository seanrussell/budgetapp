import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chart';

const MONTH_NAMES = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June",
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

export default class BudgetPeriodSummaryGraph extends LightningElement {
    
    @api history;

    @track error;
    chart;
    chartjsInitialized = false;
    

    renderedCallback() {
        if (this.history) {
            if (this.chartjsInitialized) {
                return;
            }
            this.chartjsInitialized = true;

            const labels = this.history.map((item) => {
                return item.label;
            });

            const income = this.history.map((item) => {
                return item.income;
            });

            const expense = this.history.map((item) => {
                return item.expense;
            });
    
            loadScript(this, chartjs)
                .then(() => {
                    const ctx = this.template
                        .querySelector('canvas.bar')
                        .getContext('2d');

                    const config = {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Income',
                                backgroundColor: 'rgb(54, 162, 235)',
                                borderColor: 'rgb(54, 162, 236)',
                                borderWidth: 1,
                                data: income
                            }, {
                                label: 'Expense',
                                backgroundColor: 'rgb(255, 99, 132)',
                                borderColor: 'rgb(255, 100, 132)',
                                borderWidth: 1,
                                data: expense
                            }]
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    };

                    this.chart = new window.Chart(ctx, config);
                })
                .catch(error => {
                    this.error = error;
                });

        }
    }
}