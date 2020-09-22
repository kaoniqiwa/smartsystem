import { Component, OnInit ,ViewChild} from '@angular/core';
import { BarOption, LineOption, PieOption } from "../../common/directive/echarts/echart";
import { TheDayTime, ToolService } from "../../common/tool/tool.service";
import { HowellAuthHttpService } from '../../data-core/repuest/howell-auth-http.service';
import { IndexService } from "./business/index.service";
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DivisionBusinessService } from "./business-card-grid/division-business.service";
import { Digest } from '../../data-core/repuest/digest';
import { MQTTEventService } from '../../common/tool/mqtt-event/mqtt-event.service';
import { EventPushService } from '../../common/tool/mqtt-event/event-push.service';
import { DivisionTypeEnum } from '../../common/tool/enum-helper';
import { AMapComponent } from "./amap/amap.component";
import { Title } from '@angular/platform-browser';

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
  divisionConfig ;
  bar = new BarOption();
  line = new LineOption();
  pie = new PieOption();
  cardSize: { width: number, height: number };
  moveMapSite :()=>void;
  jw6 = [
    '新虹', '广中', '黄山', '花园城', '八字桥',
    '何家宅'
  ]
  @ViewChild('aMap')
  aMap:AMapComponent;
  readonly url = '/api/howell/ver10/aiop_service/Maps';
  constructor(private httpService: HowellAuthHttpService
    , private indexService: IndexService
   , private titleService: Title
    ,private eventPushService:EventPushService
    , private divisionBusinessService: DivisionBusinessService
    , private mqttSevice: MQTTEventService) {
      titleService.setTitle('生活垃圾监管平台');
    this.bar.seriesData = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    this.bar.xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    this.bar.seriesName = ['干垃圾', '湿垃圾'];
    this.bar.legendData = ['干垃圾', '湿垃圾'];
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


  handleLoginError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403) {
        let header = error.headers as Headers;
        let digest = new Digest(header, 'api/howell/ver10/aiop_service/');
        var challenge = digest.parseServerChallenge(null);
        let authHeader = digest.generateRequestHeader(1, challenge, 'admin', '123456', 'GET', this.url);
        this.httpService.auth(this.url, authHeader)
          .toPromise();
      }
      return of(result as T);
    };
  }

  mapLoaded(mapClient: CesiumMapClient) {
    this.divisionBusinessService.mapClient = mapClient;
    this.moveMapSite();
  }

  ngOnInit() {
   
    const auth = async () => {
      await this.httpService.auth(this.url,
        new HttpHeaders({ 'X-WebBrowser-Authentication': 'Forbidden' })
      ).pipe(
        catchError(this.handleLoginError<any>())
      ).toPromise();
    }

    auth(); 
    this.mqttSevice.listenerIllegalDrop();
    this.eventPushService.connectionState.subscribe((b)=>{ 
      this.illegalDropEventCardConfig = new Array();
      this.illegalDropEventCardConfig.push({
        business: 'IllegalDropEvent',
        flipTime:60,
        cardType: 'ImageThemeCardComponent',
        state:b
      });
    });
    setTimeout(async () => {
      const county = await this.indexService.getCounty();

      const committesIds = await this.indexService.getCommittesIds();
      this.divisionBusinessService.committesIds = committesIds;
      this.divisionConfig= new Array(); 
      this.divisionConfig.push({
        business: 'DivisionList',
        cardType: 'HeaderSquareListComponent',
        border: false
      });
      this.devCardConfig = new Array();
      this.devCardConfig.push({
        business: 'DeviceStatusStatistic',
        cardType: 'StateScaleCardComponent',
        dataTime: 60*5,
        divisionsId: county.Id,
        defaultViewMoel:this.indexService.getStateScale
      });
     
   
      this.divisionGarbageSpCardConfig = new Array();
      this.divisionGarbageSpCardConfig.push({
        business: 'DivisionGarbageSpecification',
        cardType: 'HintCardComponent',
        divisionsId: county.Id,
        dataTime: 60*5,
        border: false
      });
      this.illegalDropTopCardConfig = new Array();
      this.illegalDropTopCardConfig.push({
        business: 'IllegalDropOrder',
        cardType: 'OrderTableCardComponent',
        divisionsIds: committesIds,
        dataTime: 60*5,
        defaultViewMoel:this.indexService.defaultOrderTable,
        divisionsType: DivisionTypeEnum.County,
      });
      this.illegalDropHistoryCardConfig = new Array();
      this.illegalDropHistoryCardConfig.push({
        business: 'IllegalDropHistory',
        cardType: 'LineEChartsCardComponent',
        divisionsId: county.Id,
        flipTime:60*3,
        dataTime: 60*5
      }); 
      this.moveMapSite = ()=>{
         this.divisionBusinessService.mapClient.Village.Select(county.Id);
         this.divisionBusinessService.aMap=this.aMap;
      }
      
    }, 500);
  }


}
