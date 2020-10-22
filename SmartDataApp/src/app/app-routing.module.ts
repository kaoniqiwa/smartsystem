import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'aiop',
//     pathMatch: 'full'
//   }, 
//   { path:'aiop',loadChildren:'./aiop-system/aiop-system.module#AIOPSystemModule'},
// ];
// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'waste-regulation',
//     pathMatch: 'full'
//   },
//    { path:'waste-regulation',loadChildren:'./waste-regulation-system/waste-regulation-system.module#WasteRegulationSystemModule'},
// ];
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path:'system-mode',loadChildren:'./system-module/system.module#SystemModule'},
  { path:'login',loadChildren:'./user-authentication/user-authentication.module#UserAuthenticationModule'},
  { path:'aiop',loadChildren:'./aiop-system/aiop-system.module#AIOPSystemModule'},
  { path:'waste-regulation',loadChildren:'./waste-regulation-system/waste-regulation-system.module#WasteRegulationSystemModule'}
 ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
