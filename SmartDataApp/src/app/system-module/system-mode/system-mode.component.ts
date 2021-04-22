import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { SystemModeEnum } from "../../common/tool/table-form-helper";
import { Title } from '@angular/platform-browser';
import { SideNavService } from "../../common/tool/sidenav.service";
@Component({
  selector: 'app-system-mode',
  templateUrl: './system-mode.component.html',
  styleUrls: ['./system-mode.component.styl']
})
export class SystemModeComponent implements OnInit {

  systems = new Array<SystemMode>();
  constructor(private route: Router
    ,titleService:Title
    , private sideNavService: SideNavService) {
      titleService.setTitle('生活垃圾分类全程监管平台');
    this.systems.push(new SystemMode(
      'howell-icon-cam-all1'
     , '数据统计', 98, SystemModeEnum.gisSmartData));
    this.systems.push(new SystemMode(
      'howell-icon-cam-all1'
      , '监督平台', 98, SystemModeEnum.supervision));
    this.systems.push(new SystemMode(
       'howell-icon-system'
      , '垃圾事件', 98, SystemModeEnum.illegalDropEvent));
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
      var sub = '';
      if(val == SystemModeEnum.aiopSet)sub='platform';
      if(val == SystemModeEnum.illegalDropEvent)sub='event-history';
      if(val == SystemModeEnum.supervision)sub='garbage-station';
      this.route.navigateByUrl('aiop/'+sub);
    }
    else if(val == SystemModeEnum.gisSmartData)
    return;
    //  this.route.navigateByUrl('waste-regulation');
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