import { Component, OnInit ,ViewChild} from '@angular/core';
import { HistoryLinkToolComponent } from "./history-link-tool/history-link-tool.component";
import { SideNavMenuComponent} from "./side-nav-menu/side-nav-menu.component";import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

import { HttpParams, HttpHeaders } from '@angular/common/http';
import { HowellAuthHttpService } from "../../data-core/repuest/howell-auth-http.service";
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Digest } from '../../data-core/repuest/digest';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        width:'320px'
      })),
      state('closed', style({
        width:'100px'
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class IndexComponent implements OnInit {

@ViewChild('navMenu')
navMenu:SideNavMenuComponent;
@ViewChild('historyLink')
historyLink:HistoryLinkToolComponent;

maximize = true;
readonly url = '/api/howell/ver10/aiop_service/Maps';
constructor(private httpService: HowellAuthHttpService) {
 
} 
handleLoginError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    if (error.status == 403) { 
      let header = error.headers as Headers;
      let digest = new Digest(header, 'api/howell/ver10/aiop_service/');
      var challenge = digest.parseServerChallenge(null);
      let authHeader = digest.generateRequestHeader(1, challenge,'admin','123456', 'GET', this.url);
      this.httpService.auth<any[]>(this.url, authHeader)        
      .toPromise();
    }
    return of(result as T);
  };
}

 ngOnInit() {
 this.historyLink.links=  this.navMenu.currentMenus$;
 const auth = async () => { 
  await this.httpService.auth<any[]>(this.url,
    new HttpHeaders({ 'X-WebBrowser-Authentication': 'Forbidden' })
  ).pipe(
    catchError(this.handleLoginError<any>())
  ).toPromise();
}

auth();
  }

  menuControl(maximize:boolean){ 
    this.maximize=maximize;
   this.navMenu.maximize=maximize; 
  }

}
