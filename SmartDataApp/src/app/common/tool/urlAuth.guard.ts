import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MessageBar } from "../../common/tool/message-bar";
import { Digest } from "../../data-core/repuest/digest";
import { HowellAuthHttpService } from "../../data-core/repuest/howell-auth-http.service";
import { User } from "../../data-core/url/user-url";
import { BaseUrl } from "../../data-core/url/IUrl";
import { SessionUser } from "../../common/tool/session-user";
import { Base64 } from '../../common/tool/base64';
@Injectable({
  providedIn: 'root',
})
export class UrlAuthGuard implements CanActivate {
  sessionUser: SessionUser;
  msg: MessageBar;
  formVal: { name: string, pwd: string };
  constructor(private router: Router
    , private httpService: HowellAuthHttpService) {
    this.sessionUser = new SessionUser();
    this.msg = new MessageBar();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true | UrlTree {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): true | UrlTree {
    if (url.indexOf('Auth') > -1) {
      try {
        let hideButton = '&HideButton=true';
        if (url.indexOf(hideButton) > -1) {
          url=url.replace(hideButton,'');
          window.sessionStorage.setItem('HideButton', hideButton);
        }

        let authUrl = url.split('Auth=')
          , base64 = new Base64()
          , urlParam = base64.decode(unescape(authUrl[1]))
          , paramSplit = urlParam.split('&');
        this.formVal = {
          name: paramSplit[0],
          pwd: paramSplit[1]
        }

        this.auth(this.formVal.name);

        setTimeout(() => {
          return true
        }, 2000);
      } catch {
        return this.router.parseUrl('/login');
      }

    }
    else
      return true;
  }
  handleLoginError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403) {
        let header = error.headers as Headers, userUrl = new User().login(this.formVal.name);
        let digest = new Digest(header, new BaseUrl().user);
        var challenge = digest.parseServerChallenge(null);
        let authHeader = digest.generateRequestHeader(1, challenge, this.formVal.name, this.formVal.pwd, 'GET', userUrl);
        this.httpService.auth(userUrl, authHeader).pipe(
          catchError(this.handleLoginError2<any>())
        )
          .subscribe((result: {
            Id: string,
            Role: {
              PictureData: number
              PrivacyData: number
              StaticData: number
              UserData: number
            }[],
            Resources: Array<{ Id: string, Name: string, ResourceType: number }>
          }) => {
            if (result) {
              if (result.Role && result.Role.length > 0
                && result.Role[0].PictureData === 1
                && result.Role[0].PrivacyData === 1
                && result.Role[0].StaticData === 1
                && result.Role[0].UserData === 1) {
                this.router.navigateByUrl('system-mode');
              } else { this.router.navigateByUrl('waste-regulation'); }
              this.memory(this.formVal.name, this.formVal.pwd, result.Id, result.Resources);
            }
          });
      }
      return of(result as T);
    };
  }

  handleLoginError2<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403) {
        this.msg.response_Error('账号或密码错误');
        this.router.navigateByUrl('/login');
      }
      return of(result as T);
    };
  }

  memory(name: string, pwd: string, id: string, userDivision: Array<{ Id: string, Name: string, ResourceType: number }>) {
    this.sessionUser.autoLogin = false;
    this.sessionUser.memoryPwd = false;
    this.sessionUser.name = name;
    this.sessionUser.pwd = pwd;
    this.sessionUser.id = id;
    this.sessionUser.userDivision = userDivision;

  }

  async auth(name: string) {
    const promise = await this.httpService.auth(new User().login(name),
      new HttpHeaders({ 'X-WebBrowser-Authentication': 'Forbidden' })
    ).pipe(
      catchError(this.handleLoginError<any>())
    ).toPromise();
  }
}