import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('../app/projects/auth/auth.module').then(x => x.AuthModule),
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./projects/intro/intro.module').then(m => m.IntroModule),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./projects/menu/menu.module').then(m => m.MenuModule),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./projects/faq/faq.module').then(m => m.FaqModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./projects/order/order.module').then(m => m.OrderModule),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./projects/tables/tables.module').then(m => m.TablesModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./projects/users/users.module').then(m => m.UsersModule),
  },
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'intro' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
