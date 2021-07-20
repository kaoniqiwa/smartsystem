import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { EventChartService } from "./business/event-chart.service";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
import { GetVodUrlParams } from "../../../../data-core/model/aiop/video-url";
import {
  BusinessManageService,
  ViewDivisionTypeEnum,
} from "../../business-manage-service";
import { OtherViewEnum } from "../view-helper";
import {
  SelectItemNodeModeEnum,
  TreeDropListV2Component,
} from "../../vs-class-statistic/tree-drop-list-v2/tree-drop-list-v2.component";
@Component({
  selector: "hw-statistic-garbage-count",
  templateUrl: "./statistic-garbage-count.component.html",
  styleUrls: ["./statistic-garbage-count.component.styl"],
  providers: [EventChartService, HWVideoService],
})
export class StatisticGarbageCountComponent implements OnInit, OnDestroy {
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild(TreeDropListV2Component)
  lp: TreeDropListV2Component;
  otherView = OtherViewEnum;

  selectItemNodeMode = SelectItemNodeModeEnum.EndNode;
  constructor(
    private businessService: EventChartService,
    private businessManageService: BusinessManageService,
    private videoService: HWVideoService
  ) {}

  ngOnInit() {
    this.businessService.vodVideo = async (
      param,
      cb: (webUrl: string, url: string) => void
    ) => {
      const video = await this.videoService.videoUrl(param);
      cb(video.WebUrl, video.Url);
    };
    this.businessService.playVideoToUrlFn = async (id, time, cb) => {
      const gb = this.businessService.findGarbageCountToTime(time + "");
      const param = new GetVodUrlParams();
      param.BeginTime = new Date(time).toISOString();
      param.CameraId = id;
      if (gb) {
        param.EndTime = gb.EndTime;
      } else {
        const s = new Date(time);
        s.setMinutes(s.getMinutes() + 1);
        param.EndTime = s.toISOString();
      }

      const vodUrl = await this.videoService.vodUrl(param);
      console.log(vodUrl);

      cb(vodUrl.WebUrl, vodUrl.Url);
    };
  }

  ngOnDestroy() {
    this.businessManageService.resetNone();
  }

  async defaultStation() {
    // this.garbageStationDao.allGarbageStations().then(x => {
    //   this.businessService.covertStationList(x);
    //   setTimeout(() => {
    //     if (x.length) this.selectOptionView.defaultItem(x[0].Id);
    //   },500);

    // });

    const divisions = await this.businessManageService.getchildrenDivision();
    this.businessService.divisions = divisions;
    this.businessManageService
      .getGarbageStations(this.businessManageService.user.userDivision.pop().Id)
      .then((x) => {
        this.businessService.garbageStations = x;
        // this.businessService.divisionListView = new DivisionListView();
        // if (this.businessManageService.user.userDivisionType == (DivisionType.City + '')) {
        //   this.businessService.divisionListView.toLevelListPanel(divisions.filter(x => x.ParentId != null && x.DivisionType == DivisionType.County));//多街道
        //   //跳过居委 列表数据
        //   x.map(s => {
        //     const division = divisions.find(dd => dd.Id == s.DivisionId);
        //     s.DivisionId = division.ParentId;
        //   });
        // }
        // else
        //   this.businessService.divisionListView.toLevelListPanel(divisions.filter(x => x.ParentId != null));

        // this.businessService.divisionListView.toStationList(x);
        // this.businessService.covertStationList(x);
        setTimeout(() => {
          if (
            (this.businessManageService.viewDivisionType ==
              ViewDivisionTypeEnum.MapStation ||
              this.businessManageService.viewDivisionType ==
                ViewDivisionTypeEnum.TableLinkChild) &&
            this.businessManageService
          )
            this.lp.defaultItem(
              this.businessManageService.station.Id,
              (cb) => {}
            );
          else this.lp.defaultItem(x[0].Id, (cb) => {});
        }, 500);
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
    }, 280);
  }

  clearView() {
    if (
      this.businessService.illegalDropView ||
      this.businessService.illegalDropPlayVideo ||
      this.businessService.illegalDumpView
    )
      this.businessService.clearView();
  }
}
