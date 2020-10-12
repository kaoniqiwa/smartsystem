import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoryLinkToolComponent } from "./history-link-tool/history-link-tool.component";

import { Router } from '@angular/router';
import { SideNavMenuComponent } from "./side-nav-menu/side-nav-menu.component"; 
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { SessionUser } from "../../common/tool/session-user";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        width: '320px'
      })),
      state('closed', style({
        width: '100px'
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
  navMenu: SideNavMenuComponent;
  @ViewChild('historyLink')
  historyLink: HistoryLinkToolComponent;

  maximize = true;
  constructor(private router:Router) {
    const u = new SessionUser();
    if(u.user.name=='' || u.user.pwd=='')this.router.navigateByUrl('login');
  }
  ngOnInit() {

  }

  menuControl(maximize:boolean){ 
    this.maximize=maximize;
   this.navMenu.maximize=maximize; 
  }
}
