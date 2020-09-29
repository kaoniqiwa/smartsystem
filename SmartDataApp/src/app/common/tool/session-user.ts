
import { Md5 } from 'ts-md5/dist/md5';
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

    set memoryPwd(yes: boolean) {
        localStorage.setItem('memoryPwd', yes ? '1' : '0');
    }

    get memoryPwd() {
        return localStorage.getItem('memoryPwd') == '1';
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

    set clear(yes:boolean){
        localStorage.removeItem('memoryPwd');
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('name');
        localStorage.removeItem('pwd'); 
    }
}