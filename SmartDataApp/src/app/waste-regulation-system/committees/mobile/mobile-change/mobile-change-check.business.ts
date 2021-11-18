import { Injectable } from "@angular/core";
import { MessageBar } from "src/app/common/tool/message-bar";
import { SessionUser } from "src/app/common/tool/session-user";
import { MobileBindingService } from "../mobile-binding.service";
import { MobileViewModel } from "../mobile.model";

@Injectable()
export class MobileChangeCheckBusiness {
  session = new SessionUser();
  constructor(private service: MobileBindingService) {
    this.model = this.createModel();
  }

  model: MobileViewModel;

  checkCodeResult: string;

  createModel() {
    let user = this.session.get();
    let model = new MobileViewModel();
    model.title = "验证手机号码";
    model.okButtonText = "验证";
    model.MobileNo = user.MobileNo;
    return model;
  }

  async getCheckCode() {
    let result = await this.service.sendCheckCode(this.model.MobileNo);
    this.checkCodeResult = result.Code;
  }

  async checkMobileNo() {
    // if (!this.checkCodeResult) {
    //   MessageBar.response_warning("请先验证手机号。");
    //   return;
    // }
    // if (this.checkCodeResult !== this.model.CheckCode) {
    //   MessageBar.response_warning("请正确填写验证码。");
    //   return;
    // }

    return this.service.check(this.model.MobileNo);
  }
}
