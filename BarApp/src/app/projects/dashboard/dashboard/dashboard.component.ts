import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../services/dashboard.service';
import { LoadingService } from '@common/services/loading.service';

import { ProductSelled } from '../models';
import { finalize, forkJoin } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  showData: boolean = false;
  mostSelledProducts: ProductSelled[] = [];
  chartOptions: any = {
    height: 300,
    backgroundColor: '#f0ad48',
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    is3D: true,
    titleTextStyle: {
      fontSize: '20',
      bold: 'true',
    },
  };

  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService
  ) {
    // this.getMetrics();
  }

  ngOnInit() {
    google.charts.load('45.2', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getMetrics());
  }

  async getMetrics() {
    const loading = await this.loadingService.loading();

    forkJoin([
      this.dashboardService.mostSelledProducts(),
      this.dashboardService.topFiveCustomers(),
    ])
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(([mostSelledProducts, topFiveCustomers]) => {
        this.showData = true;
        this.buildChart(
          mostSelledProducts,
          {
            ...this.chartOptions,
            title: 'Productos más vendidos en el mes',
          },
          'PieChart',
          'chart_div'
        );

        this.buildChart(
          topFiveCustomers,
          {
            ...this.chartOptions,
            title: 'Top 5 clientes',
          },
          'BarChart',
          'chart_div2'
        );
      });
  }

  buildChart(
    dataSource: any[],
    options: any,
    chartType: string,
    chartElementId: string
  ) {
    const chartWrapper = new google.visualization.ChartWrapper({
      chartType: chartType,
      containerId: chartElementId,
      options: options,
    });

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');

    dataSource.forEach((item: any) => {
      data.addRow([item.name, item.cant]);
    });

    chartWrapper.setDataTable(data);
    chartWrapper.draw();
  }

  private getChartFunction(chartType: string): any {
    const chartTypes: { [key: string]: any } = {
      PieChart: google.visualization.PieChart,
      BarChart: google.visualization.BarChart,
      // Puedes agregar más tipos de gráficos según sea necesario
    };
    return chartTypes[chartType] || google.visualization.PieChart;
  }
}
