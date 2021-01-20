import { Component, OnInit, ViewChild } from '@angular/core';
import { BarOption, LineOption, PieOption } from "../../common/directive/echarts/echart";
import { IndexService } from "./business/index.service";
import { DivisionBusinessService } from "./business-card-grid/division-business.service";
import { MQTTEventService } from '../../common/tool/mqtt-event/mqtt-event.service';
import { EventPushService } from '../../common/tool/mqtt-event/event-push.service';
import { DivisionTypeEnum } from '../../common/tool/enum-helper';
import { AMapComponent } from "./amap/amap.component";
import { Title } from '@angular/platform-browser';
import { SessionUser } from "../../common/tool/session-user";
import { ConfigRequestService } from "../../data-core/repuest/config.service";
import { targetPosition, domSize } from "../../common/tool/jquery-help/jquery-help";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  providers: [IndexService]
})
export class IndexComponent implements OnInit {
  devCardConfig;
  illegalDropEventCardConfig;
  divisionGarbageSpCardConfig;
  illegalDropTopCardConfig;
  illegalDropHistoryCardConfig;
  divisionConfig;
  inspectionConfig;

  bar = new BarOption();
  line = new LineOption();
  pie = new PieOption();
  cardSize: { width: number, height: number };

  moveMapSite: () => void;
  user = new SessionUser();
  jw6 = [
    '新虹', '广中', '黄山', '花园城', '八字桥',
    '何家宅'
  ]
  @ViewChild('aMap')
  aMap: AMapComponent;
  constructor(
    private indexService: IndexService
    , private titleService: Title
    , private configService: ConfigRequestService
    , private eventPushService: EventPushService
    , private divisionBusinessService: DivisionBusinessService
    , private mqttSevice: MQTTEventService) {
    titleService.setTitle('生活垃圾监管平台');
    this.bar.seriesData = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    this.bar.xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    this.bar.seriesName = ['干垃圾', '湿垃圾'];
    this.bar.legendData.data = ['干垃圾', '湿垃圾'];
    this.line.xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    this.line.seriesData = [820, 932, 901, 934, 1290, 1330, 1320];
    this.pie.legendData = ['干垃圾', '湿垃圾', '可回收垃圾', '有害垃圾'];
    this.pie.seriesData = [
      { value: 0, name: '干垃圾' },
      { value: 0, name: '湿垃圾' },
      { value: 0, name: '可回收垃圾' },
      { value: 0, name: '有害垃圾' }
    ];

  }
  mapLoaded(mapClient: CesiumMapClient) {
    this.divisionBusinessService.mapClient = mapClient;
    this.divisionBusinessService.aMap = this.aMap;
    this.moveMapSite();
  }


  async ngOnInit() {

    this.illegalDropEventCardConfig = new Array();
    this.illegalDropEventCardConfig.push({
      business: 'IllegalDropEvent',
      flipTime: 60,
      cardType: 'ImageThemeCardComponent',
      state: false
    });


    const videoConfig = await this.configService.getVideo().toPromise();
    this.user.video = videoConfig;
    const county = await this.indexService.getCounty();
    this.mqttSevice.listenerIllegalDrop(county.Id);
    this.eventPushService.connectionState.subscribe((b) => {
      this.divisionBusinessService.changeMqttState(b);
    });
    const committesIds = await this.indexService.getCommittesIds();
    this.divisionBusinessService.committesIds = committesIds;
    this.divisionBusinessService.divisionsId = county.Id;
    this.divisionConfig = new Array();
    this.divisionConfig.push({
      business: 'DivisionList',
      cardType: 'HeaderSquareListComponent',
      border: false
    });
    this.devCardConfig = new Array();
    this.devCardConfig.push({
      business: 'DeviceStatusStatistic',
      cardType: 'StateScaleCardComponent',
      dataTime: 60,
      divisionsId: county.Id,
      // defaultViewMoel: this.indexService.getStateScale
    });


    this.divisionGarbageSpCardConfig = new Array();
    this.divisionGarbageSpCardConfig.push({
      business: 'DivisionGarbageSpecification',
      cardType: 'HintCardComponent',
      divisionsId: county.Id,
      dataTime: 60,
      border: false
    });
    this.illegalDropTopCardConfig = new Array();
    this.illegalDropTopCardConfig.push({
      business: 'IllegalDropOrder',
      cardType: 'OrderTableCardComponent',
      divisionsIds: committesIds,
      dataTime: 60,
      // defaultViewMoel: this.indexService.defaultOrderTable,
      divisionsType: DivisionTypeEnum.County,
    });
    this.illegalDropHistoryCardConfig = new Array();
    this.illegalDropHistoryCardConfig.push({
      business: 'IllegalDropHistory',
      cardType: 'LineEChartsCardComponent',
      divisionsId: county.Id,
      flipTime: 60 * 3,
      dataTime: 60
    });
    this.inspectionConfig = new Array();
    this.inspectionConfig.push({
      business: 'GarbageStationInspection',
      cardType: 'GalleryRollPageComponent',
      divisionsId: county.Id,
      border: false
    });
    this.divisionBusinessService.nspectionParam = (val) => {
      this.inspectionConfig = [{
        business: 'GarbageStationInspection',
        cardType: 'GalleryRollPageComponent',
        divisionsId: val,
        border: false
      }];
    }
    this.moveMapSite = () => {
      this.divisionBusinessService.mapClient.Village.Select(county.Id);

    }
    this.divisionBusinessService.bindingEvent();
  }

  logOut() {
    this.user.clear = null;
  }

  showVsView(){
    this.divisionBusinessService.eventHistoryView = true;
    this.divisionBusinessService.vsClassStatistic = true;
  }

  showInspectionView() {
    this.divisionBusinessService.inspectionView = true;
    this.divisionBusinessService.bindingEvent2();
    const show = () => {
      if (this.divisionBusinessService.inspectionViewVideo == false)
        setTimeout(() => {

          const g = targetPosition('map__view'), san = targetPosition('san');
          this.divisionBusinessService.inspectionSize.left = g.left - 5;
          this.divisionBusinessService.inspectionSize.top = 0;
          const s = domSize('map__view');
          this.divisionBusinessService.inspectionSize.width = s.width - g.left + 15;
          this.divisionBusinessService.inspectionSize.height = san.top - 5;
        });
    }
    show();

    window.addEventListener("resize", () => {
      setTimeout(() => {
        /** 修正 全屏后的高度 */
        const d = domSize('map__view'), d2 = domSize('inspection_view');
        console.log(d, d2, this.divisionBusinessService.inspectionViewMaxPostion);
        if ((d.height - d2.height > 15 || d2.height - d.height > 15) && this.divisionBusinessService.inspectionViewMaxPostion == false)
          show();
      }, 50);

    });
  }
}
