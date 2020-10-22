import { Component, OnInit } from '@angular/core';
import { ListAttribute } from "../../common/tool/table-form-helper";
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModeEnum } from "../../common/tool/table-form-helper";
import {SideNavService  } from "../../common/tool/sidenav.service";
@Component({
  selector: 'app-system-mode',
  templateUrl: './system-mode.component.html',
  styleUrls: ['./system-mode.component.styl']
})
export class SystemModeComponent implements OnInit {

  systems = new Array<SystemMode>();
  constructor(private route: Router  
    ,private sideNavService:SideNavService
    , private activatedRoute: ActivatedRoute) {
    const l = new ListAttribute();
  
    this.systems.push(new SystemMode(l.imgUrlRoot+'shield1'
    ,'howell-icon-cam-all1'
    ,'垃圾监督平台',74,SystemModeEnum.supervision));
    this.systems.push(new SystemMode(l.imgUrlRoot+'shield1'
    ,'howell-icon-system'
    ,'乱扔垃圾事件',74,SystemModeEnum.illegalDropEvent));
    this.systems.push(new SystemMode(l.imgUrlRoot+'shield1'
    ,'howell-icon-garbage2'
    ,'垃圾房状态',88,SystemModeEnum.garbageStation)); 
    this.systems.push(new SystemMode(l.imgUrlRoot+'shield1'
    ,'howell-icon-setting'
    ,'系统设置',98,SystemModeEnum.aiopSet));
    this.systems.push(new SystemMode(l.imgUrlRoot+'shield1'
    ,'howell-icon-cam-all1'
    ,'',0,null));
   }

  ngOnInit() {

  }

  go(val:SystemModeEnum){
    this.sideNavService.systemMode = val;
    this.route.navigateByUrl('aiop');
  }
}

export class SystemMode {
  imgName: string;
  icon: string;
  title: string;
  titleLeft:number;
  systemMode:SystemModeEnum;
  constructor(imgName: string,
    icon: string,
    title: string, titleLeft:number
    ,systemMode:SystemModeEnum) {
    this.icon = icon;
    this.imgName = imgName;
    this.title = title;
    this.titleLeft=titleLeft;
    this.systemMode=systemMode;
  }
}