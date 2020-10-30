import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoryLinkToolComponent } from "./history-link-tool/history-link-tool.component";
import { ActivatedRoute, Router } from '@angular/router';
import { SideNavService } from "../../common/tool/sidenav.service";
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
import { Title } from '@angular/platform-browser';
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
  contentLeft = 0;
  constructor(private router: Router
    ,titleService:Title
    , private navService: SideNavService) {
      titleService.setTitle('生活垃圾监管平台');
    const u = new SessionUser();
    if (u.user.name == '' || u.user.pwd == '') this.router.navigateByUrl('login');
  }
  ngOnInit() {
   
    this.navService.playVideoBug.subscribe((x: boolean) => {
      this.bug = x;
    });
  }

  menuControl(maximize: boolean) {
    this.maximize = maximize;
    this.navMenu.maximize = maximize;
    if (this.bug) {
      this.contentLeft = this.maximize ? 296 : 100;
      domCss('mat-drawer-content',{
        'margin-left':0
      },'.');
    }

  }
}
