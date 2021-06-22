import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from "./index/index.component";
import { UrlAuthGuard } from "../common/tool/urlAuth.guard";
const routes: Routes = [
  {
    path: '', component: IndexComponent,canActivate: [UrlAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WasteRegulationSystemRoutingModule { }
