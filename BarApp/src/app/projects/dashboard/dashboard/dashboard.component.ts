import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../services/dashboard.service';
import { LoadingService } from '@common/services/loading.service';

import { ProductSelled } from '../models';
import { finalize, forkJoin } from 'rxjs';

declare var google: any;

type ChartColumn = { type: string; name: string };

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
  ) {}

  ngOnInit() {
    google.charts.load('50', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getMetrics());
  }

  async getMetrics() {
    const loading = await this.loadingService.loading();

    forkJoin([
      this.dashboardService.mostSelledProducts(),
      this.dashboardService.topFiveCustomers(),
      this.dashboardService.weeklySalesHistory(),
    ])
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        ([mostSelledProducts, topFiveCustomers, weeklySalesHistory]) => {
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
              curveType: 'function',
              legend: { position: 'none' },
            },
            'BarChart',
            'chart_div2'
          );

          this.buildChart(
            weeklySalesHistory,
            {
              ...this.chartOptions,
              title: 'Ventas semanales a lo largo del tiempo',
              legend: { position: 'none' },
            },
            'LineChart',
            'chart_div3',
            [
              { name: 'Semana', type: 'string' },
              { name: 'Ventas', type: 'number' },
            ]
          );
        }
      );
  }

  buildChart(
    dataSource: any[],
    options: any,
    chartType: string,
    chartElementId: string,
    columns?: ChartColumn[]
  ) {
    const chartWrapper = new google.visualization.ChartWrapper({
      chartType: chartType,
      containerId: chartElementId,
      options: options,
    });

    const data = new google.visualization.DataTable();
    if (columns) {
      columns.forEach((column: ChartColumn) => {
        data.addColumn(column.type, column.name);
      });
    } else {
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
    }

    dataSource.forEach((item: any) => {
      data.addRow([item.name ?? item.week.toString(), item.cant]);
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
