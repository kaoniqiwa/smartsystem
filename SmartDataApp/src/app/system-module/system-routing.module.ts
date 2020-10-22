import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import {  SystemModeComponent } from "./system-mode/system-mode.component";
const routes: Routes = [
  {
    path: '', component: SystemModeComponent     
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemModeRoutingModule { } 