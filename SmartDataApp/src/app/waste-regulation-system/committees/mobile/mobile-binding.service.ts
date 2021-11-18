import { Injectable } from "@angular/core";
import { User } from "src/app/data-core/model/user";
import { SmsRequestService } from "src/app/data-core/repuest/sms.service";
import { UserRequestService } from "src/app/data-core/repuest/user.service";

@Injectable()
export class MobileBindingService {
  constructor(
    private userService: UserRequestService,
    private smsService: SmsRequestService
  ) {}

  async check(mobileNo: string) {
    let response = await this.userService.password.checkMobileNo(mobileNo);
    return response.FaultCode === 0;
  }

  sendCheckCode(mobileNo: string) {
    return this.smsService.postAuthCodes(mobileNo);
  }

  async setUser(user: User) {
    let response = await this.userService.user.put(user);
    return response.FaultCode == 0;
  }
}
