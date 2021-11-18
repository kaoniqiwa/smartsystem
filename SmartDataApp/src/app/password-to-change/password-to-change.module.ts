import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared-module/shared.module";

import { PasswordIndexComponent } from "./index/password-index.component";
import { PasswordChangeComponent } from "./change/password-change.component";
import { PasswordToChangeRoutingModule } from "./password-to-change-routing.module";

@NgModule({
  declarations: [PasswordIndexComponent, PasswordChangeComponent],
  imports: [CommonModule, SharedModule, PasswordToChangeRoutingModule],

  exports: [],
})
export class PasswordToChangeModule {}
