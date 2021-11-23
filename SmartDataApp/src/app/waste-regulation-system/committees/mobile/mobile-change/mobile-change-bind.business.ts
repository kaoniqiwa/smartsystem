import { EventEmitter, Injectable } from "@angular/core";
import { MessageBar } from "src/app/common/tool/message-bar";
import { SessionUser } from "src/app/common/tool/session-user";
import { MobileBindingService } from "../mobile-binding.service";
import { MobileViewModel } from "../mobile.model";

@Injectable()
export class MobileChangeBindBusiness {
  session = new SessionUser();
  constructor(private service: MobileBindingService) {
    this.model = this.createModel();
  }

  model: MobileViewModel;

  checkCodeResult: string;

  stopDownCount: EventEmitter<void> = new EventEmitter();

  createModel() {
    let user = this.session.get();
    let model = new MobileViewModel();
    model.title = "绑定新手机";
    model.okButtonText = "绑定";
    return model;
  }

  async getCheckCode(mobileNo: string) {
    let result = await this.service.sendCheckCode(mobileNo);
    this.checkCodeResult = result.Code;
  }

  async bind() {
    if (!this.checkCodeResult) {
      MessageBar.response_warning("请先验证手机号。");
      return;
    }
    if (this.checkCodeResult !== this.model.CheckCode) {
      MessageBar.response_warning("请正确填写验证码。");
      return;
    }
    let user = this.session.get();
    user.MobileNo = this.model.MobileNo;
    this.session.set(user);
    return this.service.setUser(user);
  }
}
