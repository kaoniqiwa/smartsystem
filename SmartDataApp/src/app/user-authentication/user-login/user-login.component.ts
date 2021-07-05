import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  enterKeyDown,
  createVideo,
} from "../../common/tool/jquery-help/jquery-help";
import { UserLoginService } from "./user-login.service";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.styl"],
  providers: [UserLoginService],
})
export class UserLoginComponent implements OnInit {
  @ViewChild("userName")
  userName: ElementRef;

  showBg = true;

  constructor(
    private userLoginService: UserLoginService,
    titleService: Title,
    private route: ActivatedRoute
  ) {
    titleService.setTitle("用户登录");
    this.userLoginService.onLoginSuccessed = () => {
      this.onLoginSuccessed();
    };
  }

  onLoginSuccessed() {
    enterKeyDown(undefined);
  }

  ngOnInit() {
    this.userName.nativeElement.focus();
    enterKeyDown(() => {
      this.login();
    });
    this.userLoginService.fillUserForm();
    createVideo("videoLogin", "assets/img/login.webm", "videoWrap");
    setTimeout(() => {
      this.showBg = false;
    }, 1000);
    this.route.queryParams.subscribe((params) => {
      setTimeout(() => {
        /**url 授权登录 */
        this.userLoginService.urlAuthLogin({
          Auto: params.Auth,
        });
      }, 1200);
    });
  }

  autoLoginCheck() {
    this.userLoginService.autoLogin_ = !this.userLoginService.autoLogin_;
    this.userLoginService.jpwd_ = this.userLoginService.autoLogin_;
  }

  pwdCheck() {
    this.userLoginService.jpwd_ = !this.userLoginService.jpwd_;
    if (this.userLoginService.jpwd_ === false) {
      this.userLoginService.autoLogin_ = false;
    }
  }

  login() {
    return this.userLoginService.login();
  }
}
