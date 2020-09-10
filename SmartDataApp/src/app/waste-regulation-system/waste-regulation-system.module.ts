import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared-module/shared.module';
import { WasteRegulationSystemRoutingModule } from './waste-regulation-system-routing.module';
import { IndexComponent } from './index/index.component';
import {TimeToolComponent}  from './index/time/time-tool.component'
@NgModule({
  declarations: [IndexComponent,TimeToolComponent],
  imports: [
    CommonModule,SharedModule,
    WasteRegulationSystemRoutingModule
  ]
})
export class WasteRegulationSystemModule { }
