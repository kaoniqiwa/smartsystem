import { Component, OnInit } from '@angular/core';
import { ListAttribute } from "../../common/tool/table-form-helper";
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModeEnum } from "../../common/tool/table-form-helper";
import { SideNavService } from "../../common/tool/sidenav.service";
@Component({
  selector: 'app-system-mode',
  templateUrl: './system-mode.component.html',
  styleUrls: ['./system-mode.component.styl']
})
export class SystemModeComponent implements OnInit {

  systems = new Array<SystemMode>();
  constructor(private route: Router
    , private sideNavService: SideNavService
    , private activatedRoute: ActivatedRoute) {
     
    this.systems.push(new SystemMode(
      'howell-icon-cam-all1'
     , 'GIS大数据统计', 68, SystemModeEnum.gisSmartData));
    this.systems.push(new SystemMode(
      'howell-icon-cam-all1'
      , '垃圾监督平台', 74, SystemModeEnum.supervision));
    this.systems.push(new SystemMode(
       'howell-icon-system'
      , '乱扔垃圾事件', 74, SystemModeEnum.illegalDropEvent));
    this.systems.push(new SystemMode(
       'howell-icon-garbage2'
      , '垃圾房状态', 88, SystemModeEnum.garbageStation));
    this.systems.push(new SystemMode(
       'howell-icon-setting'
      , '系统设置', 98, SystemModeEnum.aiopSet));
  }

  ngOnInit() {

  }

  go(val: SystemModeEnum) {
    if (val == SystemModeEnum.aiopSet || val == SystemModeEnum.illegalDropEvent || val == SystemModeEnum.supervision) {
      this.sideNavService.systemMode = val;
      this.route.navigateByUrl('aiop');
    }
    else if(val == SystemModeEnum.gisSmartData)
     this.route.navigateByUrl('waste-regulation');
  }
}

export class SystemMode {
  icon: string;
  title: string;
  titleLeft: number;
  systemMode: SystemModeEnum;
  constructor(
    icon: string,
    title: string, titleLeft: number
    , systemMode: SystemModeEnum) {
    this.icon = icon;
    this.title = title;
    this.titleLeft = titleLeft;
    this.systemMode = systemMode;
  }
}