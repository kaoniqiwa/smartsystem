import { plainToClass } from "class-transformer";
import { DivisionType } from "src/app/data-core/model/enum";
import { User, UserResourceRole } from "src/app/data-core/model/user";
import { Md5 } from "ts-md5/dist/md5";
export class SessionUser {
  get suffix() {
    return Md5.hashStr("&*^").toString();
  }

  private readonly userIdKey = "userId";
  private readonly divisionsKey = "like_divisions";
  private readonly stationsKey = "like_stations";
  private readonly userDivisionKey = "user_division";
  private readonly userDivisionTypeKey = "user_division_type";
  private readonly userinfo = "user_info";

  get(): User {
    let str = localStorage.getItem(this.userinfo);
    let user = JSON.parse(str);
    return plainToClass(User, user);
  }
  set(user: User) {
    let str = JSON.stringify(user);
    localStorage.setItem(this.userinfo, str);
  }

  set userDivisionType(val: DivisionType) {
    localStorage.setItem(this.userDivisionTypeKey, val.toString());
  }

  get userDivisionType() {
    const val = localStorage.getItem(this.userDivisionTypeKey);
    return parseInt(val);
  }

  set userDivision(val: Array<UserResourceRole>) {
    localStorage.setItem(this.userDivisionKey, JSON.stringify(val));
  }

  get userDivision() {
    const val = localStorage.getItem(this.userDivisionKey);
    let obj = JSON.parse(val) as UserResourceRole[];
    return plainToClass(UserResourceRole, obj);
  }

  set video(val: { beforeInterval: number; afterInterval: number }) {
    localStorage.setItem("VIDEO", JSON.stringify(val));
  }

  get video() {
    const val = localStorage.getItem("VIDEO");
    return JSON.parse(val);
  }

  set id(val: string) {
    localStorage.setItem(this.userIdKey, val);
  }
  get id() {
    return localStorage.getItem(this.userIdKey);
  }

  set user(val: { name: string; pwd: string }) {
    this.pwd = val.pwd;
    this.name = val.name;
  }

  get user() {
    return {
      name: this.name,
      pwd: this.pwd,
    };
  }

  set memoryPwd(yes: boolean) {
    localStorage.setItem("memoryPwd", yes ? "1" : "0");
  }

  get memoryPwd() {
    return localStorage.getItem("memoryPwd") == "1";
  }

  set autoLogin(yes: boolean) {
    localStorage.setItem("autoLogin", yes ? "1" : "0");
  }

  get autoLogin() {
    return localStorage.getItem("autoLogin") == "1";
  }

  set name(val: string) {
    if (val == "") localStorage.removeItem("name");
    else localStorage.setItem("name", val + this.suffix);
  }

  get name() {
    const n = localStorage.getItem("name");
    return n ? n.split(this.suffix)[0] : "";
  }

  set pwd(val: string) {
    if (val == "") localStorage.removeItem("pwd");
    else localStorage.setItem("pwd", val + this.suffix);
  }

  get pwd() {
    const n = localStorage.getItem("pwd");
    return n ? n.split(this.suffix)[0] : "";
  }

  get videoUserPwd() {
    return `?user=${this.user.name}&password=${this.user.pwd}`;
  }

  set divisions(val: string[]) {
    localStorage.setItem(this.divisionsKey, val.join(","));
  }

  get divisions() {
    const n = localStorage.getItem(this.divisionsKey);
    return n ? n.split(",") : new Array();
  }

  set stations(val: string[]) {
    localStorage.setItem(this.stationsKey, val.join(","));
  }

  get stations() {
    const n = localStorage.getItem(this.stationsKey);
    return n ? n.split(",") : new Array();
  }

  clear() {
    localStorage.clear();

    // localStorage.removeItem("memoryPwd");
    // localStorage.removeItem("autoLogin");
    // localStorage.removeItem("name");
    // localStorage.removeItem("pwd");
    // localStorage.removeItem(this.divisionsKey);
    // localStorage.removeItem(this.stationsKey);
  }
}
