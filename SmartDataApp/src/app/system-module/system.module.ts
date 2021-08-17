import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared-module/shared.module";
import { SystemModeRoutingModule } from "./system-routing.module";

import { SystemModeComponent } from "./system-mode/system-mode.component";
@NgModule({
  imports: [CommonModule, SystemModeRoutingModule, SharedModule],
  declarations: [SystemModeComponent],
  exports: [],
})
export class SystemModule {}
