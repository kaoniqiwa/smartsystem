import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { GarbageStationSummaryViewPage } from "../view-helper";
import { GarbageDropEventHistoryBusinessService } from "./business/table.service";
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
import { GlobalStoreService } from "src/app/shared-module/global-store.service";

@Component({
  selector: "hw-garbage-drop-event-history",
  templateUrl: "./garbage-drop-event-history.component.html",
  styleUrls: ["./garbage-drop-event-history.component.css"],
  providers: [
    HWVideoService,
    GarbageDropEventHistoryBusinessService,
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

  @ViewChild("eventTable")
  eventTable: CustomTableComponent;

  @ViewChild("taskTable")
  taskTable: CustomTableComponent;

  otherView = GarbageStationSummaryViewPage;
  @Output() OtherViewEvent = new EventEmitter<GarbageStationSummaryViewPage>();

  @Input()
  contentType: TableContentType = TableContentType.event;

  public get taskDivisionId(): string {
    return this.tableService.taskDivisionId;
  }
  @Input()
  public set taskDivisionId(v: string) {
    debugger;
    this.tableService.taskDivisionId = v;
  }

  contentTypeView: boolean = false;
  TableContentType = TableContentType;
  changeListMode(type: TableContentType) {
    this.contentType = type;
    this.contentTypeView = false;
  }

  _handle?: boolean;
  public get handle(): boolean | undefined {
    return this._handle;
  }
  @Input()
  public set handle(v: boolean | undefined) {
    this._handle = v;
    console.log("handle", v);
  }

  private _timeout?: boolean;
  public get timeout(): boolean | undefined {
    return this._timeout;
  }
  @Input()
  public set timeout(v: boolean | undefined) {
    this._timeout = v;
    console.log("timeout", v);
  }

  constructor(
    private tableService: GarbageDropEventHistoryBusinessService,
    private divisionDao: DivisionDao,
    private videoService: HWVideoService,
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
    debugger;
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
      (d) => d.Id == GlobalStoreService.divisionId
    );
    if (division && division.DivisionType == DivisionType.City) {
      const children = this.tableService.divisions.filter(
        (f) => f.ParentId == division.Id
      );
      this.tableService.search.divisionId = children.pop().Id;
    } else {
      this.tableService.search.divisionId = GlobalStoreService.divisionId;
    }
  }
  async ngOnInit() {
    this.divisionDao.allDivisions().then((t) => {
      this.tableService.divisions = t;
      this.setSearchDivision();
      this.initEventTableList();
      this.initTaskTableList();
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
    debugger;
    this.tableService.search.other = !this.tableService.search.other;
    setTimeout(() => {
      if (this.levelListPanel) {
        const division = this.tableService.divisions.find(
          (d) => d.Id == GlobalStoreService.divisionId
        );
        if (division && division.DivisionType == DivisionType.City) {
          const children = this.tableService.divisions.filter(
            (f) => f.ParentId == division.Id
          );
          this.levelListPanel.defaultItem(children.pop().Id);
        } else this.levelListPanel.defaultItem(GlobalStoreService.divisionId);
      }
    }, 500);
  }

  async initEventTableList() {
    await this.tableService.requestData(
      1,
      { handle: this.handle, timeout: this.timeout },
      (page) => {
        this.tableService.eventTable.initPagination(
          page,
          async (index) => {
            await this.tableService.requestData(index, {
              handle: this.handle,
              timeout: this.timeout,
            });
            this.eventTable.tdImgListScoll();
          },
          true
        );
      }
    );
  }

  async initTaskTableList() {
    this.tableService.requestTaskData();
  }

  changeOtherView(val: GarbageStationSummaryViewPage) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 240);
  }

  async search() {
    this.tableService.search.state = true;
    await this.tableService.requestData(1, undefined, (page) => {
      this.tableService.eventTable.initPagination(
        page,
        async (index) => {
          await this.tableService.requestData(index);
          this.eventTable.tdImgListScoll();
        },
        true
      );
    });
  }
}

export enum TableContentType {
  event,
  task,
}
