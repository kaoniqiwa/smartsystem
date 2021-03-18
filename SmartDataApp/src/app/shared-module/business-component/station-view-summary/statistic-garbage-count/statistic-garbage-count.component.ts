import { Component, OnInit, ViewChild,Output,EventEmitter,OnDestroy } from '@angular/core';
import { EventChartService } from "./business/event-chart.service";
import { SelectOptionComponent } from "../../../select-option/select-option.component";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
import { GetVodUrlParams } from '../../../../data-core/model/aiop/video-url'; 
import { BusinessManageService,ViewDivisionTypeEnum } from "../../business-manage-service";
@Component({
  selector: 'hw-statistic-garbage-count',
  templateUrl: './statistic-garbage-count.component.html',
  styleUrls: ['./statistic-garbage-count.component.styl'],
  providers: [EventChartService, HWVideoService]
})
export class StatisticGarbageCountComponent implements OnInit,OnDestroy {
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild(SelectOptionComponent)
  selectOptionView: SelectOptionComponent;
  otherView = OtherViewEnum;
  constructor(private businessService: EventChartService
    ,private businessManageService:BusinessManageService
    , private videoService: HWVideoService) {

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

  ngOnDestroy(){
    this.businessManageService.resetNone();
  }

  defaultStation(){    
    // this.garbageStationDao.allGarbageStations().then(x => {
    //   this.businessService.covertStationList(x);
    //   setTimeout(() => {
    //     if (x.length) this.selectOptionView.defaultItem(x[0].Id);
    //   },500);

    // });

    this.businessManageService.getGarbageStations(this.businessManageService.user.userDivision.pop().Id).then(x => {
      this.businessService.covertStationList(x);
      setTimeout(() => {
        if(this.businessManageService.viewDivisionType != ViewDivisionTypeEnum.MapStation
          &&x.length)
           this.selectOptionView.defaultItem(x[0].Id);
        else if(this.businessManageService.viewDivisionType == ViewDivisionTypeEnum.MapStation
            &&x.length&&this.businessManageService)
             this.selectOptionView.defaultItem(this.businessManageService.station.Id);
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