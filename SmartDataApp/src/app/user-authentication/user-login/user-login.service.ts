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
import { Router } from '@angular/router';
import { debug } from 'console';
@Injectable()
export class UserLoginService {
    sessionUser: SessionUser;
    form: FormGroup;
    msg: MessageBar;
    formVal: { name: string, pwd: string };
    autoLogin_ = false;
    jpwd_ = false;
    constructor(private httpService: HowellAuthHttpService
        , private router: Router) {
        this.sessionUser = new SessionUser();
        this.form = new FormGroup({
            name: new FormControl(''),
            pwd: new FormControl('')
        });
        this.msg = new MessageBar();
    }

    login() {
        const formVal: { name: string, pwd: string } = this.form.value;
        if (!formVal.name)
            this.msg.response_warning('请输入账号');
        else if (!formVal.pwd)
            this.msg.response_warning('请输入密码');
        else {
            this.formVal = formVal;
            this.auth(formVal.name);
        }
    }

    fillUserForm() {
        if (this.sessionUser.autoLogin) {
            this.form.patchValue({
                name: this.sessionUser.name,
                pwd: this.sessionUser.pwd
            });
            this.jpwd_ = true;
            this.autoLogin_ = true;
            this.login();
        }
        else if (this.sessionUser.memoryPwd) {
            this.form.patchValue({
                name: this.sessionUser.name,
                pwd: this.sessionUser.pwd
            });
            this.jpwd_ = true;
        }
    }

    handleLoginError2<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            if (error.status == 403) {
                this.msg.response_Error('账号或密码错误');
            }
            return of(result as T);
        };
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
                        }[]
                    }) => {
                        if (result) {
                            debugger;
                            console.log(result);
                            // sessionStorage.setItem('userid', );
                            if (result.Role[0].PictureData === 1
                                && result.Role[0].PrivacyData === 1
                                && result.Role[0].StaticData === 1
                                && result.Role[0].UserData === 1) {
                                this.router.navigateByUrl('system-mode');
                            } else { this.router.navigateByUrl('waste-regulation'); }

                            this.memory(this.formVal.name, this.formVal.pwd, result.Id);
                        }
                    });
            }
            return of(result as T);
        };
    }

    memory(name: string, pwd: string, id: string) {
        this.sessionUser.autoLogin = this.autoLogin_;
        this.sessionUser.memoryPwd = this.jpwd_;
        this.sessionUser.name = name;
        this.sessionUser.pwd = pwd;
        this.sessionUser.id = id;

    }

    async auth(name: string) {
        const promise = await this.httpService.auth(new User().login(name),
            new HttpHeaders({ 'X-WebBrowser-Authentication': 'Forbidden' })
        ).pipe(
            catchError(this.handleLoginError<any>())
        ).toPromise();
    }
}


