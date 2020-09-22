import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Md5 } from 'ts-md5/dist/md5';
import { MessageBar } from "../../common/tool/message-bar";
import { Digest } from "../../data-core/repuest/digest";
import { HowellAuthHttpService } from "../../data-core/repuest/howell-auth-http.service";
import { User } from "../../data-core/url/user-url";
import { BaseUrl } from "../../data-core/url/IUrl";
@Injectable()
export class UserLoginService {
    sessionUser: SessionUser;
    form: FormGroup;
    msg: MessageBar;
    formVal: { name: string, pwd: string };
    autoLogin_ = false;
    jpwd_ = false;
    constructor(private httpService: HowellAuthHttpService) {
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
            this.jpwd_=true;
            this.autoLogin_=true;
            this.login();
        }
        else if(this.jpwd_) this.jpwd_=true;
    }

    handleLoginError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            if (error.status == 403) {
                let header = error.headers as Headers, userUrl = new User().login(this.formVal.name);
                let digest = new Digest(header, new BaseUrl().user);
                var challenge = digest.parseServerChallenge(null);
                let authHeader = digest.generateRequestHeader(1, challenge, this.formVal.name, this.formVal.pwd, 'GET', userUrl);
                this.httpService.auth(userUrl, authHeader)
                    .subscribe((result) => {
                        console.log(result);
                        this.memory(this.formVal.name, this.formVal.pwd);
                    });
            }
            return of(result as T);
        };
    }

    memory(name: string, pwd: string) {
        if (this.autoLogin_) {
            this.sessionUser.autoLogin = true;
            this.sessionUser.name = name;
        }
        else {
            this.sessionUser.autoLogin = false;
            this.sessionUser.name = '';
        }
        this.sessionUser.pwd = this.jpwd_ ? pwd : '';

    }

    async auth(name: string) {
        await this.httpService.auth(new User().login(name),
            new HttpHeaders({ 'X-WebBrowser-Authentication': 'Forbidden' })
        ).pipe(
            catchError(this.handleLoginError<any>())
        ).toPromise();
    }
}


export class SessionUser {
    get suffix() {
        return Md5.hashStr('&*^').toString();
    }
    set user(val: { name: string, pwd: string }) {
        this.pwd = val.pwd;
        this.name = val.name;
    }

    get user() {
        return {
            name: this.name,
            pwd: this.pwd
        }
    }

    set autoLogin(yes: boolean) {
        localStorage.setItem('autoLogin', yes ? '1' : '0');
    }

    get autoLogin() {
        return localStorage.getItem('autoLogin') == '1';
    }

    set name(val: string) {
        if (val == '') localStorage.removeItem('name');
        else localStorage.setItem('name', val + this.suffix);
    }

    get name() {
        const n = localStorage.getItem('name');
        return n ? n.split(this.suffix)[0] : '';
    }

    set pwd(val: string) {
        if (val == '') localStorage.removeItem('pwd');
        else localStorage.setItem('pwd', val + this.suffix);
    }

    get pwd() {
        const n = localStorage.getItem('pwd');
        return n ? n.split(this.suffix)[0] : '';
    }
}