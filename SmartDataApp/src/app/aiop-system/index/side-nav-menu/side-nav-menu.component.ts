import { Component, OnInit } from '@angular/core'; import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
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
 
  constructor() {
    var item = new MenuTree('howell-icon-device2','平台');   
    item.nodes.push({
      url :'/aiop/platform/platform-mgr',
      text:'平台管理'
    });
    item.nodes.push({
      url :'/aiop/platform/sr-service-mgr',
      text:'流转服务管理'
    });
    this.menuTree.push(item);
    item = new MenuTree('howell-icon-device2','区域');
    item.nodes.push({
      text:'区域管理',
      url:'/aiop/regions/region-mgr'
    }); 
    this.menuTree.push(item); 
    item = new MenuTree('howell-icon-device2','设备管理');
    item.nodes.push({
      text:'监控点',
      url:'/aiop/resources/camera-mgr'
    });
    item.nodes.push({
      text:'编码器',
      url:'/aiop/resources/encode-device-mgr'
    }); 
    item.nodes.push({
      text:'监控点模型',
      url:'/aiop/resources/camera-ai-model-mgr'
    });
    this.menuTree.push(item);
    item = new MenuTree('howell-icon-device2','AI模型');
    item.nodes.push({
      text:'AI模型列表',
      url:'/aiop/ai-models/ai-models-mgr'
    }); 
    this.menuTree.push(item);
    this.highlightedBtn = [this.menuTree[0].title];
  }

  mainBtnClick(item:MenuTree){     
      item.an=!item.an;
      this.highlightedBtn.pop();
      this.highlightedBtn = [item.title];
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


export class MenuTree {
  icon: string;
  an = true;
  title: string;
  nodes: { text: string, url: string }[];
  constructor(icon: string, title: string) {
    this.icon = icon;
    this.title = title;
    this.nodes = new Array();
  }
}

