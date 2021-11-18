import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpParams, HttpHeaders } from "@angular/common/http";

import { Base64 } from "../../common/tool/base64";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { Md5 } from "ts-md5";
import { PagedList } from "../model/page";
import { Fault } from "../model/response";
import { PasswordUrl, UserCode, UserUrl } from "../url/user-url";
import {
  ChangeUserPasswordParams,
  CheckCodeParams,
  RandomUserPaswordParams,
  VerificationCodeResult,
} from "../model/waste-regulation/user-password";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
import { Role, User } from "../model/user";

@Injectable({
  providedIn: "root",
})
export class UserConfigService {
  constructor(private http: HowellAuthHttpService) {}

  configUrl = "assets/config.json";
  config: Config;

  public getConfig(): Observable<Config> {
    // now returns an Observable of Config
    return this.http.get<any, Config>(this.configUrl);
  }

  getUserConfig(url: string): Observable<string> {
    this.http.get(url);
    return this.http
      .getBase64String(url)
      .pipe(catchError(this.handleError<string>("")));
  }

  editUserConfig(url: string, base64: string): Observable<Fault> {
    return this.http
      .putBase64String<Fault>(url, base64)
      .pipe(catchError(this.handleError<Fault>("")));
  }

  getDataList<T>(url: string, params?: HttpParams): Observable<PagedList<T>> {
    return this.http
      .get<any, PagedList<T>>(url, params)
      .pipe(catchError(this.handleError<PagedList<T>>("dataList")));
  }

  postAddData(url: string, model?: any): Observable<Fault> {
    return this.http
      .post<any, Fault>(url, model)
      .pipe(catchError(this.handleError<Fault>("")));
  }

  deleteData(url: string): Observable<Fault> {
    return this.http
      .delete<any, Fault>(url)
      .pipe(catchError(this.handleError<Fault>("deleteData")));
  }

  putEditData(url: string, model: any): Observable<Fault> {
    return this.http
      .put<any, Fault>(url, model)
      .pipe(catchError(this.handleError<Fault>("")));
  }

  postDataList<T>(url: string, model: any): Observable<PagedList<T>> {
    return this.http
      .post<any, PagedList<T>>(url, model)
      .pipe(catchError(this.handleError<PagedList<T>>("dataList")));
  }

  async getUser(userId: string): Promise<User> {
    let response = await this.http.get<User>(UserUrl.item(userId)).toPromise();
    return ServiceHelper.ResponseProcess(response, User);
  }

  getRole(url: string): Observable<Role> {
    return this.http
      .get<any, Role>(url)
      .pipe(catchError(this.handleError<Role>("")));
  }

  public handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 401 || error.status === 403) {
        // TODO: send the error to remote logging infrastructure
        // console.error(error); // log to console instead
        // Let the app keep running by returning an empty result.
        return of(result as T);
      }
    };
  }

  PasswordRandom(userId: string, params: RandomUserPaswordParams) {
    return this.http.post<RandomUserPaswordParams, string>(
      UserUrl.password_random(userId),
      params
    );
  }

  PasswordChange(userId: string, params: ChangeUserPasswordParams) {
    return this.http.post<ChangeUserPasswordParams, User>(
      UserUrl.password_change(userId),
      params
    );
  }

  GetVerificationCode(mobileNo: string) {
    return this.http.post<string>(UserCode.getCode(mobileNo)).toPromise();
  }
  async CheckVerificationCode(mobileNo: string, code: string) {
    let response = await this.http
      .post<VerificationCodeResult>(UserCode.checkCode(mobileNo, code))
      .toPromise();
    return ServiceHelper.ResponseProcess(response, VerificationCodeResult);
  }

  GetCheckCode(mobileNo: string) {
    return this.http.get<string>(PasswordUrl.CheckCode(mobileNo));
  }

  ToCheckCode(params: CheckCodeParams) {
    return this.http.post<CheckCodeParams, string>(
      PasswordUrl.CheckCode(),
      params
    );
  }

  CheckMobileNo(mobileNo: string) {
    return this.http.get<Fault>(PasswordUrl.CheckMobileNo(mobileNo));
  }
}
