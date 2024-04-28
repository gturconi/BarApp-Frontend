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

  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
    this.getMetrics();
  }

  async getMetrics() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.dashboardService.mostSelledPorducts().subscribe(data => {
        this.mostSelledProducts = data;

        this.showData = true;
      });
    } finally {
      loading.dismiss();
    }
  }

  drawChart() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');

    data.addRows([
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2],
    ]);

    // Set chart options
    var options = {
      title: 'Productos más vendidos',
      width: 400,
      height: 300,
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById('chart_div')
    );
    chart.draw(data, options);
  }
}
