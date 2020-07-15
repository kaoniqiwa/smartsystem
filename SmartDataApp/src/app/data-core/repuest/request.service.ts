import { AxiosDigestInstance } from "howell-http-lib";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private axios_: AxiosDigestInstance;
    private userName_: string;
    private pwd_: string;
    constructor() {

    }

    set userName(val: string) {
        this.userName_ = val;
    }

    get userName() {
        return this.userName_;
    }

    set pwd(val: string) {
        this.pwd_ = val;
    }

    get pwd() {
        return this.pwd_;
    }

    get axios() {
        return this.axios_ = new AxiosDigestInstance(this.userName, this.pwd, true);
    }
}