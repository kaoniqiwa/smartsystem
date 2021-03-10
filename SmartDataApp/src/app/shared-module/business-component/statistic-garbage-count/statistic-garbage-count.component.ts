import { Component, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { EventChartService } from "./business/event-chart.service";
import { GarbageStationDao } from "../../../data-core/dao/garbage-station-dao";
import { SelectOptionComponent } from "../../select-option/select-option.component";
import { HWVideoService } from "../../../data-core/dao/video-dao";
import { GetVodUrlParams } from '../../../data-core/model/aiop/video-url'; 
import { domSize } from "../../../common/tool/jquery-help/jquery-help";
@Component({
  selector: 'hw-statistic-garbage-count',
  templateUrl: './statistic-garbage-count.component.html',
  styleUrls: ['./statistic-garbage-count.component.styl'],
  providers: [EventChartService, GarbageStationDao, HWVideoService]
})
export class StatisticGarbageCountComponent implements OnInit {
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild(SelectOptionComponent)
  selectOptionView: SelectOptionComponent;
  otherView = OtherViewEnum;
  constructor(private businessService: EventChartService
    , private videoService: HWVideoService
    , private garbageStationDao: GarbageStationDao) {

  }

  ngOnInit() {
    this.businessService.vodVideo = async (param, cb: (url: string) => void) => {
      const video = await this.videoService.videoUrl(param);
      cb(video.Url);
    }
    this.businessService.playVideoToUrlFn = async (id, time, cb) => {   
      const gb = this.businessService.findGarbageCountToTime(time+'');
      const param = new GetVodUrlParams();     
      param.BeginTime =  new Date(time).toISOString();
      param.CameraId = id;
      if(gb){        
        param.EndTime =  gb.EndTime;        
      }
      else{ 
        const s = new Date(time);
        s.setMinutes(s.getMinutes()+1);
        param.EndTime =  s.toISOString(); 
      }
      
      const vodUrl=await this.videoService.vodUrl(param); console.log(vodUrl);
      
      cb(vodUrl.Url);
    }
  } 

  defaultStation(){    
    this.garbageStationDao.allGarbageStations().then(x => {
      this.businessService.covertStationList(x);
      setTimeout(() => {
        if (x.length) this.selectOptionView.defaultItem(x[0].Id);
      },500);

    });
  } 

  videoClick() {
    this.businessService.playingVideo();
  }

  // showIllegalDumpView(stationId:string){
  //    this.businessService.illegalDumpVideoImgsView(stationId);
  // }
  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    },280);
  }

  clearView(){ 
  
    if(this.businessService.illegalDropView || this.businessService.illegalDropPlayVideo
      ||this.businessService.illegalDumpView)
    this.businessService.clearView();
 

  }
}
export enum OtherViewEnum {
  chart,
  info,
  sumChart,
  analyzeChart
}