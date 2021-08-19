import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { OtherViewEnum } from "../view-helper";
import { BusinessService } from "./business/event-table.service";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationCameraDao } from "../../../../data-core/dao/garbage-station-camera-dao";
import { LevelListPanelComponent } from "../../event-history/level-list-panel/level-list-panel.component";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { CustomTableComponent } from "../../../custom-table/custom-table.component";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
import { GetVodUrlParams } from "../../../../data-core/model/aiop/video-url";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { DivisionType } from "../../../../data-core/model/enum";
@Component({
  selector: "hw-garbage-drop-event-history",
  templateUrl: "./garbage-drop-event-history.component.html",
  styleUrls: ["./garbage-drop-event-history.component.styl"],
  providers: [
    HWVideoService,
    BusinessService,
    DivisionDao,
    GarbageStationDao,
    GarbageStationCameraDao,
  ],
})
export class GarbageDropEventHistoryComponent implements OnInit {
  tableMinusHeight = "calc(100% - 0px)";
  tableSearchHeight = "calc(100% - 44px)";

  @ViewChild(LevelListPanelComponent)
  levelListPanel: LevelListPanelComponent;

  @ViewChild(CustomTableComponent)
  table: CustomTableComponent;

  otherView = OtherViewEnum;
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  constructor(
    private tableService: BusinessService,
    private divisionDao: DivisionDao,
    private videoService: HWVideoService,
    private divisionBusinessService: DivisionBusinessService,
    private garbageStationCameraDao: GarbageStationCameraDao,
    private garbageStationDao: GarbageStationDao
  ) {}
  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
  };

  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  };

  videoClose = () => {
    this.tableService.videoImgs = null;
    this.tableService.playVideo = null;
  };
  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  };

  changeStation(val: string) {
    this.tableService.search.appendResourcesDropList(
      this.tableService.cameras.filter((r) => r.GarbageStationId == val)
    );
  }

  changeDivisionFn = (divisionId: string) => {
    if (divisionId) {
      const garbageStations = this.tableService.stations.filter(
        (x) => x.DivisionId == divisionId
      );
      this.tableService.search.appendStationsDropList(garbageStations);
      const resources = new Array<Camera>();
      garbageStations.map((x) => {
        this.tableService.cameras
          .filter((r) => r.GarbageStationId == x.Id)
          .map((c) => {
            resources.push(c);
          });
      });
      this.tableService.search.appendResourcesDropList(resources);
      this.tableService.search.divisionId = divisionId;
      this.tableService.search.stationId = "";
    } else {
      this.tableService.search.appendResourcesDropList(
        this.tableService.cameras
      );
      this.tableService.search.appendStationsDropList(
        this.tableService.stations
      );
    }
  };
  setSearchDivision() {
    const division = this.tableService.divisions.find(
      (d) => d.Id == this.divisionBusinessService.divisionsId
    );
    if (division && division.DivisionType == DivisionType.City) {
      const children = this.tableService.divisions.filter(
        (f) => f.ParentId == division.Id
      );
      this.tableService.search.divisionId = children.pop().Id;
    } else
      this.tableService.search.divisionId =
        this.divisionBusinessService.divisionsId;
  }
  async ngOnInit() {
    this.divisionDao.allDivisions().then((t) => {
      this.tableService.divisions = t;
      this.setSearchDivision();
      this.initTableList();
      this.tableService.divisionListView.toLevelListPanel(
        t.filter((x) => x.ParentId != null)
      );
    });
    this.garbageStationCameraDao.garbageStationCameras().then((t) => {
      this.tableService.cameras = t;
      this.tableService.search.appendResourcesDropList(t);
    });
    this.garbageStationDao.allGarbageStations().then((t) => {
      this.tableService.stations = t;
      this.tableService.search.appendStationsDropList(t);
    });
    this.tableService.playVideoToUrlFn = async (id, time, cb) => {
      const param = new GetVodUrlParams();
      param.CameraId = id;
      param.BeginTime = time;
      param.EndTime = time;
      this.videoService.videoUrl(param).then((video) => {
        cb(video.WebUrl, video.Url);
      });
    };
  }

  moreSearch() {
    this.tableService.search.other = !this.tableService.search.other;
    setTimeout(() => {
      if (this.levelListPanel && this.divisionBusinessService.divisionsId) {
        const division = this.tableService.divisions.find(
          (d) => d.Id == this.divisionBusinessService.divisionsId
        );
        if (division && division.DivisionType == DivisionType.City) {
          const children = this.tableService.divisions.filter(
            (f) => f.ParentId == division.Id
          );
          this.levelListPanel.defaultItem(children.pop().Id);
        } else
          this.levelListPanel.defaultItem(
            this.divisionBusinessService.divisionsId
          );
      }
    }, 500);
  }

  async initTableList() {
    await this.tableService.requestData(1, (page) => {
      this.tableService.table.initPagination(
        page,
        async (index) => {
          await this.tableService.requestData(index);
          this.table.tdImgListScoll();
        },
        true
      );
    });
  }

  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 240);
  }

  async search() {
    this.tableService.search.state = true;
    await this.tableService.requestData(1, (page) => {
      this.tableService.table.initPagination(
        page,
        async (index) => {
          await this.tableService.requestData(index);
          this.table.tdImgListScoll();
        },
        true
      );
    });
  }
}
