import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chart';

export default class BudgetPeriodDetailSummaryChart extends LightningElement {
    @api totalIncome;
    @api totalExpenses;
    @api totalSavings;

    allValuesPopulated() {
        return this.totalIncome && this.totalExpenses && this.totalSavings;
    }

    renderedCallback() {
        if (this.allValuesPopulated()) {
            const dataLabels = [
                'Income', 
                'Expense', 
                'Savings'
            ];

            const dataValues = [
                this.totalIncome.toFixed(2),
                this.totalExpenses.toFixed(2),
                this.totalSavings.toFixed(2)
            ];

            if (this.chartjsInitialized) {
                this.chart.destroy();
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
            .querySelector('canvas.doughnut')
            .getContext('2d');

        const config = {
            type: 'doughnut',
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