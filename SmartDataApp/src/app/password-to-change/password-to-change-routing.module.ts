import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PasswordUrlAuthGuard } from "../common/tool/password-url-auth.guard";
import { PasswordIndexComponent } from "./index/password-index.component";

const routes: Routes = [
  {
    path: "",
    component: PasswordIndexComponent,
    canActivate: [PasswordUrlAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordToChangeRoutingModule {}
