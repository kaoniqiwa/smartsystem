import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./common/tool/auth.guard";
const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "system-mode",
    loadChildren: "./system-module/system.module#SystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    loadChildren:
      "./user-authentication/user-authentication.module#UserAuthenticationModule",
  },
  {
    path: "aiop",
    loadChildren: "./aiop-system/aiop-system.module#AIOPSystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: "waste-regulation",
    loadChildren:
      "./waste-regulation-system/waste-regulation-system.module#WasteRegulationSystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: "waste-regulation-committees",
    loadChildren:
      "./waste-regulation-system/committees/waste-regulation-committees-system.module#WasteRegulationCommitteesSystemModule",
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
