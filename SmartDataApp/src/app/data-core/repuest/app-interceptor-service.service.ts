import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MessageBar } from "../../common/tool/message-bar";
@Injectable({
  providedIn: 'root'
})
export class AppInterceptorServiceService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> { 
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    const msg = new MessageBar();
    switch (event.status) {
      case 500:
        msg.response_Error('操作失败');
        break;
      case 503:
        msg.response_Error('操作失败');
        break;
        case 400:
          msg.response_Error('操作失败');
          break;
      case 404:

        break;
      default:
    }

    return throwError(event);
  }
}
