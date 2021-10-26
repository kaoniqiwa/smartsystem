import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UrlAuthGuard } from "../../common/tool/urlAuth.guard";
import { IndexCommitteesComponent } from "./index/committees-index.component";

const routes: Routes = [
  {
    path: "",
    component: IndexCommitteesComponent,
    canActivate: [UrlAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasteRegulationCommitteesSystemRoutingModule {}
