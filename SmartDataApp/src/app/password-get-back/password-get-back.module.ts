import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared-module/shared.module";
import { PasswordGetBackRoutingModule } from "./password-get-back-routing.module";
import { PasswordCheckNameComponent } from "./check-name/password-check-name.component";
import { PasswordGetBackIndexComponent } from "./index/password-index.component";

@NgModule({
  declarations: [PasswordGetBackIndexComponent, PasswordCheckNameComponent],
  imports: [CommonModule, SharedModule, PasswordGetBackRoutingModule],

  exports: [],
})
export class PasswordGetBackModule {}
