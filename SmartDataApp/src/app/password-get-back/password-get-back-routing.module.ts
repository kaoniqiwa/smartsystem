import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PasswordGetBackIndexComponent } from "./index/password-index.component";

const routes: Routes = [
  {
    path: "",
    component: PasswordGetBackIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordGetBackRoutingModule {}
