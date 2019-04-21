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
            const dataLabels = [
                'Income', 
                'Expense', 
                'Savings'
            ];

            const dataValues = [
                this.summary.totalIncome.toFixed(2),
                this.summary.totalExpense.toFixed(2),
                this.summary.totalSavings.toFixed(2)
            ];

            if (this.chartjsInitialized) {
                this.generateChart(dataLabels, dataValues);
                return;
            }
            
            this.chartjsInitialized = true;
            
            loadScript(this, chartjs)
                .then(() => {
                    this.generateChart(dataLabels, dataValues);
                })
                .catch(error => {
                    this.error = error;
                });
        }
    }

    generateChart(dataLabels, dataValues) {
        const ctx = this.template
            .querySelector('canvas.pie')
            .getContext('2d');

        const config = {
            type: 'pie',
            data: {
                labels: dataLabels,
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
    }
}