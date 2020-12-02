import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SessionUser } from "../../common/tool/session-user";
import { Digest } from './digest'; 
import {Response  } from "../model/response";
   

@Injectable({
  providedIn: 'root'
})
export class HowellAuthHttpService {

  nc=0; 
  constructor(private http: HttpClient) {
  }


  public postBase64String(url: string, base64: string, params?: HttpParams): Observable<Blob> {
    const myHeaders = this.getHttpHeaders('POST', url);
    const head = new HttpHeaders({
      'Authorization': myHeaders.get('Authorization'),
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.http.post(url, base64, {
      headers: head,
      params: params,
      responseType: 'blob'
    });
  }

  public putBase64String<T>(url: string, base64: string, params?: HttpParams): Observable<T> {
    const myHeaders = this.getHttpHeaders('PUT', url);
    const head = new HttpHeaders({
      'Authorization': myHeaders.get('Authorization'),
      'Content-Type': 'text/plain',
      'Accept': 'text/plain'
    });
    return this.http.put<T>(url, base64, {
      headers: head,
      params: params,
      responseType: 'json'
    });
  }

  public getBase64String(url: string, params?: HttpParams): Observable<string> {
    const myHeaders = this.getHttpHeaders('GET', url);
    return this.http.get(url, {
      headers: myHeaders,
      params: params,
      responseType: 'text'
    });
  }

  public get<T = any, R = Response<T>>(url: string, params?: HttpParams): Observable<R> {
    const myHeaders = this.getHttpHeaders('GET', url);
    const httpOptions = {
      headers: myHeaders,
      params: params
    };
    return this.http.get<R>(url, httpOptions);
  }

  public post<T = any, R = Response<T>>(url: string, model?: any, params?: HttpParams): Observable<R> {
    const myHeaders = this.getHttpHeaders('POST', url);
    const httpOptions = {
      headers: myHeaders,
      params: params
    };
    return this.http.post<R>(url, model, httpOptions);
  }

  public postString<T = any, R = Response<T>>(url: string, base64: string, params?: HttpParams): Observable<R> {
    const myHeaders = this.getHttpHeaders('POST', url);

    const httpOptions = {
      headers: myHeaders,
      params: params,
      'Content-Type': 'text/plain'
    };
    return this.http.post<R>(url, base64, httpOptions);
  }


  public put<T = any, R = Response<T>>(url: string, model: T): Observable<R> {
    const myHeaders = this.getHttpHeaders('PUT', url);
    const httpOptions = {
      headers: myHeaders
    };
    return this.http.put<R>(url, model, httpOptions);
  }


  public delete<T = any, R = Response<T>>(url: string): Observable<R> {
    const myHeaders = this.getHttpHeaders('DELETE', url);
    const httpOptions = {
      headers: myHeaders
    };
    return this.http.delete<R>(url, httpOptions);
  }

  public auth(url: string, httpHeaders: HttpHeaders): Observable<Response<any>> {
    const httpOptions = {
      headers: httpHeaders
    };
    return this.http.get<any>(url, httpOptions);
  }

  //获取已授权的头部
  getHttpHeaders(method: string, uri: string) {  
    let digest = new Digest(),user = new SessionUser();
    var challenge = digest.parseServerChallenge(null); 
    this.nc+=1;
    return digest.generateRequestHeader(this.nc, challenge, user.name, user.pwd, method, uri);
  }
}
