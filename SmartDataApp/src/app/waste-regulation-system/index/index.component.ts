import { Component, OnInit } from '@angular/core';
import { BarOption, LineOption, PieOption } from "../../common/directive/echarts/echart";
import { TheDayTime, ToolService } from "../../common/tool/tool.service";
import { HowellAuthHttpService } from '../../data-core/repuest/howell-auth-http.service';

import { HttpParams, HttpHeaders } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Digest } from '../../data-core/repuest/digest';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  providers: [ToolService]
})
export class IndexComponent implements OnInit {
  devCardConfig = new Array();
  bar = new BarOption();
  line = new LineOption();
  pie = new PieOption();
  cardSize: { width: number, height: number };
  jw = [
    '新虹', '广中', '黄山', '花园城', '八字桥',
    '何家宅', '商一', '同济', '恒业', '同心',
    '华昌', '广灵', '西江湾', '广二', '广三'
  ]
  jw6 = [
    '新虹', '广中', '黄山', '花园城', '八字桥',
    '何家宅'
  ]
  readonly url = '/api/howell/ver10/aiop_service/Maps';
  constructor(private httpService: HowellAuthHttpService) {
    
    console.log(this.cardSize);

    this.bar.seriesData = [
      [120, 200, 150, 80, 70, 110, 130],
      [90, 120, 60, 10, 30, 98, 60]
    ];
    this.bar.xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    this.bar.seriesName = ['干垃圾', '湿垃圾'];
    this.bar.legendData = ['干垃圾', '湿垃圾'];
    this.line.xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    this.line.seriesData = [820, 932, 901, 934, 1290, 1330, 1320];
    this.pie.legendData = ['干垃圾', '湿垃圾', '可回收垃圾', '有害垃圾'];
    this.pie.seriesData = [
      { value: 335, name: '干垃圾' },
      { value: 310, name: '湿垃圾' },
      { value: 234, name: '可回收垃圾' },
      { value: 135, name: '有害垃圾' }
    ];
    this.devCardConfig.push({
      business: 'DeviceStatusStatistic',
      cardType: 'StateScaleCardComponent',
      divisionsId: '310109011035'
    });
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

  ngOnInit() {
 
    const auth = async () => {
      await this.httpService.auth(this.url,
        new HttpHeaders({ 'X-WebBrowser-Authentication': 'Forbidden' })
      ).pipe(
        catchError(this.handleLoginError<any>())
      ).toPromise();
    }

    auth();
  }


}
