import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./projects/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("../app/projects/auth/auth.module").then((x) => x.AuthModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
