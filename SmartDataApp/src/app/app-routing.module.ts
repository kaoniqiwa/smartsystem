import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./common/tool/auth.guard";

export enum RoutePaths {
  main = "",
  system = "system-mode",
  wasteRegulation = "waste-regulation",
  wasteRegulationCommittees = "waste-regulation-committees",
  aiop = "aiop",
  login = "login",
  passwordGetBack = "password-get-back",
  passwordToChange = "password-to-change",
}
const routes: Routes = [
  {
    path: RoutePaths.main,
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: RoutePaths.system,
    loadChildren: "./system-module/system.module#SystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: RoutePaths.login,
    loadChildren:
      "./user-authentication/user-authentication.module#UserAuthenticationModule",
  },
  {
    path: RoutePaths.aiop,
    loadChildren: "./aiop-system/aiop-system.module#AIOPSystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: RoutePaths.wasteRegulation,
    loadChildren:
      "./waste-regulation-system/waste-regulation-system.module#WasteRegulationSystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: RoutePaths.wasteRegulationCommittees,
    loadChildren:
      "./waste-regulation-system/committees/waste-regulation-committees-system.module#WasteRegulationCommitteesSystemModule",
    canActivate: [AuthGuard],
  },
  {
    path: RoutePaths.passwordGetBack,
    loadChildren:
      "./password-get-back/password-get-back.module#PasswordGetBackModule",
  },
  {
    path: RoutePaths.passwordToChange,
    loadChildren:
      "./password-to-change/password-to-change.module#PasswordToChangeModule",
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
