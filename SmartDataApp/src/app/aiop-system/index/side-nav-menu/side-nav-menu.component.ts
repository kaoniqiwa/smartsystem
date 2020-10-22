import { Component, OnInit } from '@angular/core'; import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import {  MenuTree ,MenuTreeMap} from "./menu-tree"; 
import { SideNavService } from "../../../common/tool/sidenav.service";
@Component({
  selector: 'side-nav-menu',
  templateUrl: './side-nav-menu.component.html',
  styleUrls: ['./side-nav-menu.component.styl'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        width: '260px'
      })),
      state('closed', style({
        width: '70px'
      })),
      transition('open => closed', [
        animate('0.1s')
      ]),
      transition('closed => open', [
        animate('0.1s')
      ]),
    ]),
  ],
})
export class SideNavMenuComponent implements OnInit {
  maximize = true;
  private currentMenus_ = new Array<string>();
  private highlightedBtn = new Array<string>();
  menuTree = new Array<MenuTree>();

  constructor(private route: ActivatedRoute, private navService: SideNavService) {
    const  
     menuTreeMap = new MenuTreeMap();
     menuTreeMap.init();
     this.menuTree =menuTreeMap.map.get(navService.systemMode);
    this.highlightedBtn = [this.menuTree[0].title];


  }

  mainBtnClick(item: MenuTree) {
    if (this.maximize) {
      this.menuTree.map(x => x.an = false);
      item.an = !item.an;
      this.highlightedBtn.pop();
      this.highlightedBtn = [item.title];
    }

  }

  set currentMenus(val: string) {
    this.currentMenus_.pop();
    this.currentMenus_.push(val);
  }

  get currentMenus$() {
    return this.currentMenus_;
  }
  ngOnInit() {

  }

}



