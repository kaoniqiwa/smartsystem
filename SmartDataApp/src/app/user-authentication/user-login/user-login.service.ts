import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MessageBar } from "../../common/tool/message-bar";
import { Digest } from "../../data-core/repuest/digest";
import { HowellAuthHttpService } from "../../data-core/repuest/howell-auth-http.service";
import { User } from "../../data-core/url/user-url";
import { BaseUrl } from "../../data-core/url/IUrl";
import { SessionUser } from "../../common/tool/session-user";
import { Router } from "@angular/router";
import { Base64 } from "../../common/tool/base64";
@Injectable()
export class UserLoginService {
  sessionUser: SessionUser;
  form: FormGroup;
  msg: MessageBar;
  formVal: { name: string; pwd: string };
  autoLogin_ = false;
  jpwd_ = false;
  constructor(
    private httpService: HowellAuthHttpService,
    private router: Router
  ) {
    this.sessionUser = new SessionUser();
    this.form = new FormGroup({
      name: new FormControl(""),
      pwd: new FormControl(""),
    });
    this.msg = new MessageBar();
  }

  onLoginSuccessed?: () => void;
  onLoginFaulted?: () => void;

  login() {
    const formVal: { name: string; pwd: string } = this.form.value;
    if (!formVal.name) this.msg.response_warning("请输入账号");
    else if (!formVal.pwd) this.msg.response_warning("请输入密码");
    else {
      this.formVal = formVal;
      return this.auth(formVal.name);
    }
  }

  urlAuthLogin(param: { Auto: string }) {
    if (param && param.Auto) {
      let base64 = new Base64(),
        urlParam = base64.decode(param.Auto),
        paramSplit = urlParam.split("&");
      try {
        this.form.patchValue({
          name: paramSplit[0],
          pwd: paramSplit[1],
        });
        this.login();
      } catch {}
    }
  }

  fillUserForm() {
    if (this.sessionUser.autoLogin) {
      this.form.patchValue({
        name: this.sessionUser.name,
        pwd: this.sessionUser.pwd,
      });
      this.jpwd_ = true;
      this.autoLogin_ = true;
      this.login();
    } else if (this.sessionUser.memoryPwd) {
      this.form.patchValue({
        name: this.sessionUser.name,
        pwd: this.sessionUser.pwd,
      });
      this.jpwd_ = true;
    }
  }

  handleLoginError2<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403) {
        this.msg.response_Error("账号或密码错误");
      }
      if (this.onLoginFaulted) {
        this.onLoginFaulted();
      }
      return of(result as T);
    };
  }

  handleLoginError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403) {
        let header = error.headers as Headers,
          userUrl = new User().login(this.formVal.name);
        let digest = new Digest(header, new BaseUrl().user);
        var challenge = digest.parseServerChallenge(null);
        let authHeader = digest.generateRequestHeader(
          1,
          challenge,
          this.formVal.name,
          this.formVal.pwd,
          "GET",
          userUrl
        );
        this.httpService
          .auth(userUrl, authHeader)
          .pipe(catchError(this.handleLoginError2<any>()))
          .subscribe(
            (result: {
              Id: string;
              Role: {
                PictureData: number;
                PrivacyData: number;
                StaticData: number;
                UserData: number;
              }[];
              Resources: Array<{
                Id: string;
                Name: string;
                ResourceType: number;
              }>;
            }) => {
              if (result) {
                console.log(result);
                // sessionStorage.setItem('userid', );
                if (
                  result.Role &&
                  result.Role.length > 0 &&
                  result.Role[0].PictureData === 1 &&
                  result.Role[0].PrivacyData === 1 &&
                  result.Role[0].StaticData === 1 &&
                  result.Role[0].UserData === 1
                ) {
                  this.router.navigateByUrl("system-mode");
                } else {
                  this.router.navigateByUrl("waste-regulation");
                }

                if (this.onLoginSuccessed) {
                  this.onLoginSuccessed();
                }

                this.memory(
                  this.formVal.name,
                  this.formVal.pwd,
                  result.Id,
                  result.Resources
                );
              }
            }
          );
      }
      return of(result as T);
    };
  }

  memory(
    name: string,
    pwd: string,
    id: string,
    userDivision: Array<{ Id: string; Name: string; ResourceType: number }>
  ) {
    this.sessionUser.autoLogin = this.autoLogin_;
    this.sessionUser.memoryPwd = this.jpwd_;
    this.sessionUser.name = name;
    this.sessionUser.pwd = pwd;
    this.sessionUser.id = id;
    this.sessionUser.userDivision = userDivision;
  }

  async auth(name: string) {
    return this.httpService
      .auth(
        new User().login(name),
        new HttpHeaders({ "X-WebBrowser-Authentication": "Forbidden" })
      )
      .pipe(catchError(this.handleLoginError<any>()))
      .toPromise();
  }
}
