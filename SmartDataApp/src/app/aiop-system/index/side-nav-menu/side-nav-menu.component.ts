import { Component, OnInit,Output,EventEmitter } from '@angular/core'; import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { Router } from '@angular/router';
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
  private highlightedBtn = new Array<string>();
  menuTree = new Array<MenuTree>();
  menuTreeMap:MenuTreeMap;
  @Output() menuEvent = new EventEmitter<string>();

  constructor(router: Router, private navService: SideNavService) {
    const  
     menuTreeMap = new MenuTreeMap();
     menuTreeMap.init();
     this.menuTreeMap=menuTreeMap;
     this.initMenuTree();
   //  router.navigate([this.menuTree[0].nodes[0].url])

  }

  initMenuTree(){
    this.menuTree =this.menuTreeMap.map.get(this.navService.systemMode);
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
    this.menuEvent.emit(val);
  }

    ngOnInit() {

      this.currentMenus=this.menuTree[0].nodes[0].text;
  }

}



