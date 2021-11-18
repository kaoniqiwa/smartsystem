import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RoutePaths } from "../app-routing.module";
import { User } from "../data-core/model/user";
import { CheckCodeParams } from "../data-core/model/waste-regulation/user-password";
import { UserRequestService } from "../data-core/repuest/user.service";
@Injectable()
export class PasswordGetBackService {
  constructor(
    private router: Router,
    private userService: UserRequestService
  ) {}

  loginSuccessedEvent: (user: User) => void;

  async checkMobileNo(mobileNo: string) {
    let fault = await this.userService.password.checkMobileNo(mobileNo);
    return fault.FaultCode === 0;
  }

  async urlToLogin() {
    this.router.navigateByUrl(RoutePaths.login);
  }

  async getCheckCode(mobileNo: string) {
    return this.userService.password.getCheckCode(mobileNo);
  }

  toCheckCode(mobileNo: string, code: string) {
    let params = new CheckCodeParams();
    params.MobileNo = mobileNo;
    params.CheckCode = code;
    return this.userService.password.toCheckCode(params);
  }
}
