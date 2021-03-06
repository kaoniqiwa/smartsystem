import { Component, OnInit, ViewChild } from "@angular/core";
import {
  BarOption,
  LineOption,
  PieOption,
} from "../../common/directive/echarts/echart";
import { IndexService } from "./business/index.service";
import { IndexBusinessService } from "./business/index-business.service";
import { DivisionBusinessService } from "./business-card-grid/division-business.service";
import { MQTTEventService } from "../../common/tool/mqtt-event/mqtt-event.service";
import { EventPushService } from "../../common/tool/mqtt-event/event-push.service";
import { AMapComponent } from "./amap/amap.component";
import { Title } from "@angular/platform-browser";
import { SessionUser } from "../../common/tool/session-user";
import { ConfigRequestService } from "../../data-core/repuest/config.service";
import {
  targetPosition,
  domSize,
} from "../../common/tool/jquery-help/jquery-help";
import { GarbageStationDao } from "../../data-core/dao/garbage-station-dao";
import {
  BusinessManageService,
  ViewDivisionTypeEnum,
} from "../../shared-module/business-component/business-manage-service";
import { EventType } from "../../data-core/model/enum";
import { ActivatedRoute } from "@angular/router";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { UserLoginService } from "src/app/user-authentication/user-login/user-login.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.styl"],
  providers: [IndexService, IndexBusinessService, GarbageStationDao],
})
export class IndexComponent implements OnInit {
  bar = new BarOption();
  line = new LineOption();
  pie = new PieOption();
  cardSize: { width: number; height: number };

  moveMapSite: () => void;
  get HideButton() {
    return GlobalStoreService.HideButton;
  }
  get HideTitlebar() {
    return GlobalStoreService.HideTitlebar;
  }
  user = new SessionUser();
  userDivisionName_ = "";
  GlobalStoreService = GlobalStoreService;
  @ViewChild("aMap")
  aMap: AMapComponent;
  constructor(
    private stationDao: GarbageStationDao,
    private indexService: IndexService,
    private indexBusinessService: IndexBusinessService,
    private titleService: Title,
    private businessManageService: BusinessManageService,
    private configService: ConfigRequestService,
    private eventPushService: EventPushService,
    private divisionBusinessService: DivisionBusinessService,
    private mqttSevice: MQTTEventService,
    private activatedRoute: ActivatedRoute
  ) {
    titleService.setTitle("????????????????????????????????????");
    this.bar.seriesData = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    this.bar.xAxisData = [
      "??????",
      "??????",
      "??????",
      "??????",
      "??????",
      "??????",
      "??????",
    ];
    this.bar.seriesName = ["?????????", "?????????"];
    this.bar.legendData.data = ["?????????", "?????????"];
    this.line.xAxisData = [
      "??????",
      "??????",
      "??????",
      "??????",
      "??????",
      "??????",
      "??????",
    ];
    this.line.seriesData = [820, 932, 901, 934, 1290, 1330, 1320];
    this.pie.legendData = ["?????????", "?????????", "????????????", "????????????"];
    this.pie.seriesData = [
      { value: 0, name: "?????????" },
      { value: 0, name: "?????????" },
      { value: 0, name: "????????????" },
      { value: 0, name: "????????????" },
    ];
  }
  mapLoaded(mapClient: CesiumMapClient) {
    this.divisionBusinessService.aMap = this.aMap;
    this.moveMapSite();
  }

  async ngOnInit() {
    GlobalStoreService.runInterval();

    console.log("ngOnInit");

    this.activatedRoute.queryParams.subscribe((param) => {
      // console.log("HideButton:", param);
      for (const key in param) {
        if (key.toLowerCase() == "hidebutton") {
          GlobalStoreService.HideButton = JSON.parse(param[key]);
        }
        if (key.toLowerCase() == "hidetitlebar") {
          GlobalStoreService.HideTitlebar = JSON.parse(param[key]);
        }
      }
    });

    this.indexBusinessService.setLogoTitle();
    const videoConfig = await this.configService.getVideo().toPromise();
    this.user.video = videoConfig;

    this.indexBusinessService.initCardConfig();

    setTimeout(() => {
      this.divisionBusinessService.bindingEvent();

      if (this.indexBusinessService.illegalDropEventCardConfig) {
        this.mqttSevice.listenerIllegalDrop(
          this.indexBusinessService.user.userDivision.pop().Id
        );
        this.eventPushService.connectionState.subscribe((b: any) => {
          this.divisionBusinessService.changeMqttState(b);
        });
      }
    }, 500);

    this.divisionBusinessService.nspectionParam = (val) => {
      this.indexBusinessService.inspectionCard(val);
      // this.inspectionConfig = [{
      //   business: 'GarbageStationInspection',
      //   cardType: 'GalleryRollPageComponent',
      //   divisionsId: val,
      //   border: false
      // }];
    };
    this.moveMapSite = () => {
      const mapStation = (station: any) => {
        this.businessManageService.viewDivisionType =
          ViewDivisionTypeEnum.MapStation;
        this.businessManageService.station = station;
      };
      this.divisionBusinessService.aMap.VillageSelect(
        this.indexBusinessService.user.userDivision.pop().Id,
        true
      );
      this.aMap.ContextMenuIllegalDropClickedEvent.subscribe((station) => {
        mapStation(station);
        this.divisionBusinessService.illegalDrop(GlobalStoreService.divisionId);
      });
      this.aMap.ContextMenuMixedIntoClickedEvent.subscribe((station) => {
        mapStation(station);
        this.divisionBusinessService.mixedInto(GlobalStoreService.divisionId);
      });
      this.aMap.ContextMenuStationPatrolClickedEvent.subscribe((station) => {
        this.showInspectionView(station);
      });
      this.aMap.ContextMenuGarbageCountClickedEvent.subscribe((station) => {
        mapStation(station);
        this.divisionBusinessService.stationListView = true;
        this.divisionBusinessService.eventHistoryView = true;
      });
    };

    this.divisionBusinessService.linkChildView = (id, eventType, drop2) => {
      const mapStation = (station: any) => {
        this.businessManageService.viewDivisionType =
          ViewDivisionTypeEnum.TableLinkChild;
        this.businessManageService.station = station;
      };

      this.stationDao.allGarbageStations().then((stations) => {
        const station = stations.find((x) => x.Id == id);
        mapStation(station);
        if (station && drop2 == null) {
          this.divisionBusinessService.stationListView = true;
          this.divisionBusinessService.eventHistoryView = true;
        } else {
          if (eventType == EventType.IllegalDrop)
            this.divisionBusinessService.illegalDrop(id);
          else if (eventType == EventType.MixedInto)
            this.divisionBusinessService.mixedInto(id);
        }
      });
    };
  }

  logOut() {
    this.user.clear = null;
  }

  showVsView() {
    this.divisionBusinessService.eventHistoryView = true;
    this.divisionBusinessService.vsClassStatistic = true;
  }

  showInspectionView(station?: any) {
    if (station)
      this.indexBusinessService.inspectionCard(
        GlobalStoreService.divisionId,
        station.Id
      );
    else
      this.indexBusinessService.inspectionCard(GlobalStoreService.divisionId);
    this.divisionBusinessService.inspectionView = true;
    this.divisionBusinessService.bindingEvent2();
    const show = () => {
      if (this.divisionBusinessService.inspectionViewVideo == false)
        setTimeout(() => {
          const g = targetPosition("map__view"),
            san = targetPosition("san");
          this.divisionBusinessService.inspectionSize.left = g.left - 5;
          this.divisionBusinessService.inspectionSize.top = 0;
          const s = domSize("map__view");
          this.divisionBusinessService.inspectionSize.width =
            s.width - g.left + 15;
          this.divisionBusinessService.inspectionSize.height = san.top - 1;
        });
    };
    show();

    window.addEventListener("resize", () => {
      setTimeout(() => {
        /** ?????? ?????????????????? */
        const d = domSize("map__view"),
          d2 = domSize("inspection_view");
        console.log(
          d,
          d2,
          this.divisionBusinessService.inspectionViewMaxPostion
        );
        if (
          (d.height - d2.height > 15 || d2.height - d.height > 15) &&
          this.divisionBusinessService.inspectionViewMaxPostion == false
        )
          show();
      }, 50);
    });
  }
}
