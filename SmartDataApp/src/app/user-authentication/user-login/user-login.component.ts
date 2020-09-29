import { Component, OnInit, ViewChild, ElementRef, Directive, HostListener } from '@angular/core';
import { enterKeyDown } from "../../common/tool/jquery-help/jquery-help";
import { UserLoginService } from "./user-login.service";
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.styl'],
  providers: [UserLoginService]
})
export class UserLoginComponent implements OnInit {
  @ViewChild('userName')
  userName: ElementRef;
 
  constructor(private userLoginService: UserLoginService) { }

  ngOnInit() {
    this.userName.nativeElement.focus();
    enterKeyDown(()=>{
      this.userLoginService.login();
    }) 
    this.userLoginService.fillUserForm();
  }

  autoLoginCheck(){
    this.userLoginService.autoLogin_ = !this.userLoginService.autoLogin_;
    this.userLoginService.jpwd_=this.userLoginService.autoLogin_; 
  }

  pwdCheck(){
    this.userLoginService.jpwd_ = !this.userLoginService.jpwd_;
    if (this.userLoginService.jpwd_ == false)this.userLoginService.autoLogin_=false;
  }
}
