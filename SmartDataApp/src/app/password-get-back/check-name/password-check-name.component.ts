import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HowellUri } from "src/app/common/howell-uri";
import { MessageBar } from "src/app/common/tool/message-bar";
import { PasswordCheckCodeResult } from "src/app/data-core/model/waste-regulation/user-password";
import { PasswordGetBackService } from "../password-get-back.service";

@Component({
  selector: "app-password-check-name",
  templateUrl: "./password-check-name.component.html",
  styleUrls: ["./password-check-name.component.css"],
  providers: [PasswordGetBackService],
})
export class PasswordCheckNameComponent implements OnInit {
  form: FormGroup = new FormGroup({
    mobileNo: new FormControl(""),
    checkCode: new FormControl(""),
  });

  @ViewChild("checkCodeButton")
  checkCodeButton: ElementRef;

  @Output()
  CheckMobileNoResult: EventEmitter<PasswordCheckCodeResult> = new EventEmitter();

  constructor(private passwordService: PasswordGetBackService) {}

  ngOnInit() {}

  get mobileNo() {
    return this.form.value.mobileNo;
  }
  get checkCode() {
    return this.form.value.checkCode;
  }

  seconds: number = 0;

  getCheckCodeDisabled: boolean = false;

  countdown() {
    setTimeout(() => {
      this.seconds--;
      this.checkCodeButton.nativeElement.disabled =
        this.seconds > 0 ? "disabled" : "";
      this.getCheckCodeDisabled = true;
      if (this.seconds > 0) {
        this.countdown();
      }
    }, 1000);
  }

  async getCheckCode() {
    if (!this.mobileNo) {
      MessageBar.response_warning("请输入手机号码");
      return;
    }
    let checked = await this.passwordService.checkMobileNo(this.mobileNo);
    if (!checked) {
      MessageBar.response_warning(
        "很抱歉，未找到此账号，请检查手机号码是否正确。"
      );
      return;
    }
    this.seconds = 60;
    this.checkCodeButton.nativeElement.disabled = "disabled";
    this.getCheckCodeDisabled = true;
    this.countdown();

    this.form.controls.checkCode.enable();

    let code = await this.passwordService.getCheckCode(this.mobileNo);
    if (code === this.mobileNo) {
      MessageBar.response_success("验证码已发送。");
    }
  }

  async next() {
    if (!this.mobileNo) {
      MessageBar.response_warning("请输入手机号码。");
      return;
    }
    if (!this.checkCode) {
      MessageBar.response_warning("请输入验证码。");
      return;
    }
    let checked = await this.passwordService.toCheckCode(
      this.mobileNo,
      this.checkCode
    );
    if (checked && checked.Result && checked.RedirectUrl) {
      let str = checked.RedirectUrl;
      if (
        location.hostname == "127.0.0.1" ||
        location.hostname == "localhost"
      ) {
        let url = new HowellUri(checked.RedirectUrl);
        url.Host = location.hostname;
        url.Port = location.port;
        str = url.toString();
      }
      console.log(checked);
      location.href = str;
    }
  }

  backToLogin() {
    this.passwordService.urlToLogin();
  }
}
