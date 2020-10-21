import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoryLinkToolComponent } from "./history-link-tool/history-link-tool.component";

import { Router } from '@angular/router';
import { SideNavService } from "./sidenav.service";
import { domCss } from "../../common/tool/jquery-help/jquery-help";
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
  bug = false;
  constructor(private router: Router, private navService: SideNavService) {
    const u = new SessionUser();
    if (u.user.name == '' || u.user.pwd == '') this.router.navigateByUrl('login');
  }
  ngOnInit() {

    this.navService.playVideoBug.subscribe((x: boolean) => {
      this.bug = x;
    });
  }

  get leftSize() {
    var left = 0;
    if (this.bug&&this.maximize==false) {
      left = this.maximize ? 296 : 100;
      domCss('mat-drawer-content',{
        'margin-left':0
      },'.')
    }
    return left;
  }

  menuControl(maximize: boolean) {
    this.maximize = maximize;
    this.navMenu.maximize = maximize;
  }
}
