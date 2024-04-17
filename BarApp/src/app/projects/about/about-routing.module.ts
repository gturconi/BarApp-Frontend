import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about-component/about.component';
import { AboutComponentAdmin } from './about-component-admin/about.component.admin';
import { AboutRouteComponent } from './about-route/about.route.component';
import { AboutService } from './services/about.service';

const routes: Routes = [
  {
    path: '',
    component: AboutRouteComponent,
    children: [
      {
        path: '',
        component: AboutComponent,
      },
      {
        path: 'edit',
        component: AboutComponentAdmin,
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AboutService]
})
export class AboutRoutingModule {}
