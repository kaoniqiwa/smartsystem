
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SharedModule } from '../shared-module/shared.module';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserAuthenticationRoutingModule } from "./user-authentication-routing.module";

@NgModule({
  imports: [
    CommonModule,UserAuthenticationRoutingModule,
    SharedModule,
  ],
  declarations: [
  UserLoginComponent],
  exports:[
  ]
})
export class UserAuthenticationModule { }
