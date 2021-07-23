import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { SessionUser } from "../../common/tool/session-user";
import { Digest } from "./digest";
import { HowellResponse } from "../model/response";

@Injectable({
  providedIn: "root",
})
export class HowellAuthHttpService {
  nc = 0;
  constructor(private http: HttpClient) {}

  public postBase64String(
    url: string,
    base64: string,
    params?: HttpParams
  ): Observable<Blob> {
    const myHeaders = this.getHttpHeaders("POST", url);
    const head = new HttpHeaders({
      Authorization: myHeaders.get("Authorization"),
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.http.post(url, base64, {
      headers: head,
      params: params,
      responseType: "blob",
    });
  }

  public putBase64String<T>(
    url: string,
    base64: string,
    params?: HttpParams
  ): Observable<T> {
    const myHeaders = this.getHttpHeaders("PUT", url);
    const head = new HttpHeaders({
      Authorization: myHeaders.get("Authorization"),
      "Content-Type": "text/plain",
      Accept: "text/plain",
    });
    return this.http.put<T>(url, base64, {
      headers: head,
      params: params,
      responseType: "json",
    });
  }

  public getBase64String(url: string, params?: HttpParams): Observable<string> {
    const myHeaders = this.getHttpHeaders("GET", url);
    return this.http.get(url, {
      headers: myHeaders,
      params: params,
      responseType: "text",
    });
  }

  public getStream(url: string, params?: HttpParams): Observable<Blob> {
    const myHeaders = this.getHttpHeaders("GET", url);
    const head = new HttpHeaders({
      Authorization: myHeaders.get("Authorization"),
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.http.get(url, {
      headers: head,
      params: params,
      responseType: "blob",
    });
  }

  public get<T = any, R = HowellResponse<T>>(
    url: string,
    params?: HttpParams
  ): Observable<R> {
    const myHeaders = this.getHttpHeaders("GET", url);
    const httpOptions = {
      headers: myHeaders,
      params: params,
    };
    return this.http.get<R>(url, httpOptions);
  }

  public getCache<T = any, R = T>(url: string, params?: HttpParams) {
    const myHeaders = this.getHttpHeaders("GET", url);
    const httpOptions = {
      "Cache-Control": "max-age=" + 60 * 30,
      headers: myHeaders,
      params: params,
    };
    return this.http.get<R>(url, httpOptions);
  }

  public post<T = any, R = HowellResponse<T>>(
    url: string,
    model?: any,
    params?: HttpParams
  ): Observable<R> {
    const myHeaders = this.getHttpHeaders("POST", url);
    const httpOptions = {
      headers: myHeaders,
      params: params,
    };
    return this.http.post<R>(url, model, httpOptions);
  }

  public postString<T = any, R = HowellResponse<T>>(
    url: string,
    base64: string,
    params?: HttpParams
  ): Observable<R> {
    const myHeaders = this.getHttpHeaders("POST", url);

    const httpOptions = {
      headers: myHeaders,
      params: params,
      "Content-Type": "text/plain",
    };
    return this.http.post<R>(url, base64, httpOptions);
  }

  public put<T = any, R = HowellResponse<T>>(
    url: string,
    model: T
  ): Observable<R> {
    const myHeaders = this.getHttpHeaders("PUT", url);
    const httpOptions = {
      headers: myHeaders,
    };
    return this.http.put<R>(url, model, httpOptions);
  }

  public delete<T = any, R = HowellResponse<T>>(url: string): Observable<R> {
    const myHeaders = this.getHttpHeaders("DELETE", url);
    const httpOptions = {
      headers: myHeaders,
    };
    return this.http.delete<R>(url, httpOptions);
  }

  public auth(
    url: string,
    httpHeaders: HttpHeaders
  ): Observable<HowellResponse<any>> {
    const httpOptions = {
      headers: httpHeaders,
    };
    return this.http.get<any>(url, httpOptions);
  }

  downloadFile(
    url: string,
    percent: (percent: number) => void,
    completely: (completely: boolean) => void
  ) {
    const req = new HttpRequest("GET", url, {
      reportProgress: true,
    });

    this.http.request(req).subscribe((event) => {
      // Via this API, you get access to the raw event stream.
      // Look for download progress events.
      if (event.type === HttpEventType.DownloadProgress) {
        // This is an download progress event. Compute and show the % done:
        const percentDone = Math.round((100 * event.loaded) / event.total);
        percent(percentDone);
        // console.log(`File is ${percentDone}% downloaded.`);
      } else if (event instanceof HttpResponse) {
        completely(true);
        // console.log('File is completely downloaded!');
      }
    });
  }

  //获取已授权的头部
  getHttpHeaders(method: string, uri: string) {
    let digest = new Digest(),
      user = new SessionUser();
    var challenge = digest.parseServerChallenge(null);
    this.nc += 1;
    return digest.generateRequestHeader(
      this.nc,
      challenge,
      user.name,
      user.pwd,
      method,
      uri
    );
  }
}
