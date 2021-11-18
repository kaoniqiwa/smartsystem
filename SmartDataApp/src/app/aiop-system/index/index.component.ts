import { Component, OnInit, ViewChild } from "@angular/core";
import { HistoryLinkToolComponent } from "./history-link-tool/history-link-tool.component";
import { ActivatedRoute, Router } from "@angular/router";
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
} from "@angular/animations";
import { SessionUser } from "../../common/tool/session-user";
import { Title } from "@angular/platform-browser";
import { SystemModeEnum } from "../../common/tool/table-form-helper";
import { ConfigRequestService } from "../../data-core/repuest/config.service";
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.styl", "./index.component.less"],
  animations: [
    trigger("openClose", [
      // ...
      state(
        "open",
        style({
          width: "320px",
        })
      ),
      state(
        "closed",
        style({
          width: "100px",
        })
      ),
      transition("open => closed", [animate("0.5s")]),
      transition("closed => open", [animate("0.5s")]),
    ]),
  ],
})
export class IndexComponent implements OnInit {
  systemMode = new Array<{ name: string; icon: string; linkType: number }>();
  @ViewChild("navMenu")
  navMenu: SideNavMenuComponent;
  @ViewChild("historyLink")
  historyLink: HistoryLinkToolComponent;

  maximize = true;
  bug = false;
  contentLeft = 0;
  u: SessionUser;
  constructor(
    private router: Router,
    titleService: Title,
    private configService: ConfigRequestService,
    private navService: SideNavService
  ) {
    titleService.setTitle("生活垃圾分类全程监管平台");
    this.u = new SessionUser();
    if (this.u.user.name == "" || this.u.user.pwd == "") {
      this.router.navigateByUrl("login");
    }
  }
  async ngOnInit() {
    this.systemMode.push({
      icon: "howell-icon-cam-all1",
      name: "数据统计",
      linkType: SystemModeEnum.gisSmartData,
    });
    this.systemMode.push({
      icon: "howell-icon-cam-all1",
      name: "监督平台",
      linkType: SystemModeEnum.supervision,
    });
    this.systemMode.push({
      icon: "howell-icon-system",
      name: "垃圾事件",
      linkType: SystemModeEnum.illegalDropEvent,
    });
    this.systemMode.push({
      icon: "howell-icon-setting",
      name: "系统设置",
      linkType: SystemModeEnum.aiopSet,
    });
    this.systemMode.push({
      icon: "howell-icon-home",
      name: "返回首页",
      linkType: null,
    });

    this.navService.playVideoBug.subscribe((x: boolean) => {
      this.bug = x;
    });

    const config = await this.configService.getVideo().toPromise();
    this.u.video = config;
  }

  menuControl(maximize: boolean) {
    this.maximize = maximize;
    this.navMenu.maximize = maximize;
    if (this.bug) {
      this.contentLeft = this.maximize ? 296 : 100;
      domCss(
        "mat-drawer-content",
        {
          "margin-left": 0,
        },
        "."
      );
    }
  }

  go(val: SystemModeEnum) {
    if (
      val == SystemModeEnum.aiopSet ||
      val == SystemModeEnum.illegalDropEvent ||
      val == SystemModeEnum.supervision
    ) {
      this.navService.systemMode = val;
      this.navMenu.initMenuTree();
      var sub = "";
      if (val == SystemModeEnum.aiopSet) sub = "platform";
      if (val == SystemModeEnum.illegalDropEvent) sub = "event-history";
      if (val == SystemModeEnum.supervision) sub = "garbage-station";
      this.router.navigateByUrl("aiop/" + sub);
    } else if (val == SystemModeEnum.gisSmartData)
      this.router.navigateByUrl("waste-regulation");
    else if (val == null) this.router.navigateByUrl("system-mode");
  }

  changeMenuLink(val: string) {
    this.historyLink.links = [val];
  }
}
