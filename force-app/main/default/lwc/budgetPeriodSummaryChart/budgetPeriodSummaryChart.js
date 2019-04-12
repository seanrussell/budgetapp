import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chart';

export default class BudgetPeriodSummaryChart extends LightningElement {
    
    @api summary;

    @track error;
    chart;
    chartjsInitialized = false;

    renderedCallback() {
        if (this.summary) {
            if (this.chartjsInitialized) {
                return;
            }
            this.chartjsInitialized = true;

            const dataValues = [
                this.summary.totalIncome,
                this.summary.totalExpense,
                this.summary.totalSavings
            ];

            loadScript(this, chartjs)
                .then(() => {
                    const ctx = this.template
                        .querySelector('canvas.pie')
                        .getContext('2d');

                    const config = {
                        type: 'pie',
                        data: {
                            labels: ['Income', 'Expense', 'Savings'],
                            datasets: [
                                {
                                    data: dataValues,
                                    backgroundColor: [
                                        'rgb(54, 162, 235)',
                                        'rgb(255, 99, 132)',
                                        'rgb(75, 192, 192)'
                                    ],
                                    label: 'Income &amp; Expense Summary'
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'right'
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
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