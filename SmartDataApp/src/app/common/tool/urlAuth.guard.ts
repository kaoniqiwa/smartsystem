import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MessageBar } from "../../common/tool/message-bar";
import { Digest } from "../../data-core/repuest/digest";
import { HowellAuthHttpService } from "../../data-core/repuest/howell-auth-http.service";
import { UserUrl } from "../../data-core/url/user-url";
import { BaseUrl } from "../../data-core/url/IUrl";
import { SessionUser } from "../../common/tool/session-user";
import { Base64 } from "../../common/tool/base64";

import { EnumHelper } from "./enum-helper";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { HowellUri } from "../howell-uri";
import { ConfigRequestService } from "src/app/data-core/repuest/config.service";
import { User, UserResourceRole } from "src/app/data-core/model/user";
@Injectable({
  providedIn: "root",
})
export class UrlAuthGuard implements CanActivate {
  sessionUser: SessionUser;

  formVal: { name: string; pwd: string };
  constructor(
    private router: Router,
    private configService: ConfigRequestService,
    private httpService: HowellAuthHttpService
  ) {
    this.sessionUser = new SessionUser();
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    let result = await this.checkLogin(url);

    return result;
  }

  checkLogin(url: string): Promise<true | UrlTree> {
    return new Promise((resolve) => {
      let uri = new HowellUri(url);
      if (uri.Querys) {
        try {
          // let hideButton = "&HideButton=true";
          // if (url.indexOf(hideButton) > -1) {
          //   url = url.replace(hideButton, "");
          //   window.sessionStorage.setItem("HideButton", hideButton);
          // }

          // let authUrl = url.split("Auth=");
          // let base64 = new Base64();
          // let urlParam = base64.decode(unescape(authUrl[1]));
          // let paramSplit = urlParam.split("&");
          // this.formVal = {
          //   name: paramSplit[0],
          //   pwd: paramSplit[1],
          // };
          let auto = false;
          for (const key in uri.Querys) {
            if (key.toLocaleLowerCase() === "auth") {
              let base64 = new Base64();
              let encode = decodeURIComponent(uri.Querys[key]);
              let urlParam = base64.decode(encode);
              let paramSplit = urlParam.split("&");
              this.formVal = {
                name: paramSplit[0],
                pwd: paramSplit[1],
              };
              auto = true;
            } else if (key.toLocaleLowerCase() === "hidetitlebar") {
              GlobalStoreService.HideTitlebar = JSON.parse(uri.Querys[key]);
            } else if (key.toLocaleLowerCase() === "hidebutton") {
              GlobalStoreService.HideButton = JSON.parse(uri.Querys[key]);
            } else {
            }
          }
          if (auto) {
            //this.sessionUser.clear();
          }
          setTimeout(() => {
            this.auth(this.formVal.name).then(() => {
              resolve(true);
            });
          }, 2000);
        } catch {
          resolve(this.router.parseUrl("/login"));
        }
      } else {
        resolve(true);
      }
    });
  }
  handleLoginError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403) {
        let header = error.headers as Headers,
          userUrl = UserUrl.login(this.formVal.name);
        let digest = new Digest(header, BaseUrl.user);
        var challenge = digest.parseServerChallenge();
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
          .subscribe((result: User) => {
            if (result) {
              debugger;
              GlobalStoreService.user = result;
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
              this.memory(
                this.formVal.name,
                this.formVal.pwd,
                result.Id,
                result.Resources,
                result
              );
            }
          });
      }
      return of(result as T);
    };
  }

  handleLoginError2<T>(operation = "operation", result?: T) {
    let observable = (error: any): Observable<T> => {
      if (error.status == 403) {
        MessageBar.response_Error("账号或密码错误");

        this.router.navigateByUrl("/login");
      }

      return of(result as T);
    };

    return observable;
  }

  memory(
    name: string,
    pwd: string,
    id: string,
    userDivision: Array<UserResourceRole>,
    user: User
  ) {
    this.sessionUser.set(user);
    this.sessionUser.autoLogin = false;
    this.sessionUser.memoryPwd = false;
    this.sessionUser.name = name;
    this.sessionUser.pwd = pwd;
    this.sessionUser.id = id;
    this.sessionUser.userDivision = userDivision;
    if (userDivision.length > 0) {
      this.sessionUser.userDivisionType = EnumHelper.Convert(
        userDivision[0].ResourceType
      );
    }
    this.configService
      .getVideo()
      .toPromise()
      .then((config) => {
        this.sessionUser.video = config;
      });
  }

  async auth(name: string) {
    let auth = await this.httpService
      .auth(
        UserUrl.login(name),
        new HttpHeaders({ "X-WebBrowser-Authentication": "Forbidden" })
      )

      .pipe(catchError(this.handleLoginError<any>()))
      .toPromise();
  }
}
