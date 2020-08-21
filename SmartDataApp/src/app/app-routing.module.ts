import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'aiop',
    pathMatch: 'full'
  },
  { path:'aiop',loadChildren:'./aiop-system/aiop-system.module#AIOPSystemModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
