import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import { UrlAuthGuard } from "../common/tool/urlAuth.guard";
import { IndexCommitteesComponent } from "./index/index.component-committees";
const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    canActivate: [UrlAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasteRegulationSystemRoutingModule {}

const committees_routes: Routes = [
  {
    path: "",
    component: IndexCommitteesComponent,
    canActivate: [UrlAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(committees_routes)],
  exports: [RouterModule],
})
export class WasteRegulationCommitteesSystemRoutingModule {}
