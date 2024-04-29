import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../services/dashboard.service';
import { LoadingService } from '@common/services/loading.service';

import { ProductSelled } from '../models';

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
    title: 'Productos más vendidos en el mes',
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
    this.getMetrics();
  }

  ngOnInit() {
    google.charts.load('43', { packages: ['corechart'] });
  }

  async getMetrics() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.dashboardService.mostSelledProducts().subscribe(data => {
        this.showData = true;
        var options = {
          title: 'Productos más vendidos en el mes',
          height: 300,
          backgroundColor: '#f0ad48',
          colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
          is3D: true,
          titleTextStyle: {
            fontSize: '20',
            bold: 'true',
            color: 'var(--color-11)',
          },
        };
        this.buildChart(data, options);
      });
    } finally {
      loading.dismiss();
    }
  }

  buildChart(dataSource: any[], options?: any) {
    let items: any = [];
    var renderChart = (chart: any) => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');

      dataSource.map((item: any) => items.push([item.name, item.cant]));
      data.addRows(items);

      chart().draw(data, options);
    };
    var chart = () =>
      new google.visualization.PieChart(document.getElementById('chart_div'));
    var callback = () => renderChart(chart);
    google.charts.setOnLoadCallback(callback);
  }
}
