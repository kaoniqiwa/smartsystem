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
  constructor() { }

 ngOnInit() {
 this.historyLink.links=  this.navMenu.currentMenus$;
  }

  menuControl(maximize:boolean){ 
    this.maximize=maximize;
   this.navMenu.maximize=maximize;
     
  }

}
