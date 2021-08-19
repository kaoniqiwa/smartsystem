import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { CustomTableComponent } from "../../../custom-table/custom-table.component";
import { EventTableService, FillMode } from "./business/event-table.service";
import { PageListMode } from "../../../../common/tool/enum-helper";
import { ImageDesc } from "../../../image-desc-card/image-desc";
import { Router } from "@angular/router";
import { SideNavService } from "../../../../common/tool/sidenav.service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { SystemModeEnum } from "../../../../common/tool/table-form-helper";
import { LevelListPanelComponent } from "../../event-history/level-list-panel/level-list-panel.component";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
import { GetVodUrlParams } from "../../../../data-core/model/aiop/video-url";
import { PlayVideo } from "../../../../aiop-system/common/play-video";
@Component({
  selector: "hw-garbage-full-history",
  templateUrl: "./garbage-full-history.component.html",
  styleUrls: ["./garbage-full-history.component.styl"],
  providers: [EventTableService, HWVideoService],
})
export class GarbageFullHistoryComponent implements OnInit {
  listTypeView = false;
  otherDrop = false;
  otherView = OtherViewEnum;
  listMode = PageListMode.table;
  pageListMode = PageListMode;
  tableMinusHeight = "calc(100% - 0px)";
  tableSearchHeight = "calc(100% - 44px)";
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild("table")
  table: CustomTableComponent;
  @ViewChild(LevelListPanelComponent)
  levelListPanel: LevelListPanelComponent;

  @Input() fillMode: FillMode;

  /**
   * 用于页面 判断
   */
  @Input() isPage: boolean;
  @Input() changeViewFn: (index: number) => void;
  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  };

  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  };
  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
  };

  changeDivisionFn = (divisionId: string) => {
    if (divisionId) {
      const garbageStations = this.tableService.garbageStations.filter(
        (x) => x.DivisionId == divisionId
      );
      this.tableService.search.appendStationsDropList(garbageStations);
      const resources = new Array<Camera>();
      garbageStations.map((x) => {
        this.tableService.resources
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
        this.tableService.resources
      );
      this.tableService.search.appendStationsDropList(
        this.tableService.garbageStations
      );
    }
  };

  listGalleryTargetFn = (val: ImageDesc) => {
    const event = this.tableService.eventTable.findEventFn(val.id);
    this.tableService.galleryTargetView.initGalleryTarget(event, 0);
    this.tableService.galleryTargetView.galleryTarget.videoName = true;
  };

  videoClose = () => {
    this.tableService.videoImgs = null;
    this.tableService.playVideo = null;
  };

  constructor(
    private tableService: EventTableService,
    private navService: SideNavService,
    private videoService: HWVideoService,
    private divisionBusinessService: DivisionBusinessService,
    private router: Router
  ) {}

  changeStation(val: string) {
    this.tableService.search.appendResourcesDropList(
      this.tableService.resources.filter((r) => r.GarbageStationId == val)
    );
  }

  async ngOnInit() {
    this.tableService.search.divisionId = this.fillMode
      ? this.fillMode.divisionId
      : "";
    this.listMode = this.fillMode
      ? this.fillMode.pageListMode
      : PageListMode.table;
    this.tableService.fillMode = this.fillMode;
    if (this.isPage) {
      this.tableMinusHeight = "calc(100% - 20px)";
      this.tableSearchHeight = "calc(100% - 64px)";
      this.tableService.fillMode = new FillMode();
      this.tableService.fillMode.divisionId =
        this.divisionBusinessService.divisionsId;

      if (this.divisionBusinessService.divisionsId) {
        this.tableService.search.divisionId =
          this.divisionBusinessService.divisionsId;
      }
    }

    this.tableService.garbageStations =
      await this.tableService.requestGarbageStations();
    this.initTableList();
    // this.tableService.eventTable.tableSelectIds = this.tableSelectIds;
    this.tableService.divisions = await this.tableService.requestDivisions();

    this.tableService.resources = await this.tableService.requestResource();
    this.tableService.search.appendResourcesDropList(
      this.tableService.resources
    );
    this.tableService.search.appendStationsDropList(
      this.tableService.garbageStations
    );

    this.tableService.divisionListView.toLevelListPanel(
      this.tableService.divisions.filter((x) => x.ParentId != null)
    );
    this.tableService.allEventsRecordData();

    this.tableService.playVideoToUrlFn = async (id, time, cb) => {
      const param = this.tableService.getVodUrlParam(
          null,
          id,
          time + "",
          time + ""
        ),
        video = await this.videoService.videoUrl(param);
      cb(video.WebUrl, video.Url);
    };

    this.tableService.playVideoFn = async (ids) => {
      const idV = ids.split("&"),
        param = this.tableService.getVodUrlParam(idV[1], idV[0]),
        video = await this.videoService.videoUrl(param),
        cameraName = this.tableService.getCameraName(idV[1], idV[0]),
        pv = new PlayVideo(video.WebUrl, video.Url, cameraName);
      pv.url = video.Url;
      this.tableService.playVideo = pv;
    };
  }

  moreSearch() {
    this.tableService.search.other = !this.tableService.search.other;
    setTimeout(() => {
      if (this.levelListPanel && this.divisionBusinessService.divisionsId)
        this.levelListPanel.defaultItem(
          this.divisionBusinessService.divisionsId
        );
    }, 500);
  }

  goMoreHistroy() {
    this.navService.systemMode = SystemModeEnum.illegalDropEvent;
    this.router.navigateByUrl("aiop/event-history/illegal-drop-event?p=1");
  }

  changeView(tagIndex: number) {
    this.changeViewFn(tagIndex);
  }

  async initTableList() {
    if (this.tableService.search.state == false) {
      if (this.listMode == PageListMode.table)
        await this.tableService.requestData(1, (page) => {
          this.tableService.eventTable.initPagination(
            page,
            async (index) => {
              await this.tableService.requestData(index);
            },
            !this.isPage
          );
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.requestDataX(1, (page) => {
          this.tableService.eventCards.initPagination(
            page,
            async (index) => {
              await this.tableService.requestDataX(index);
            },
            !this.isPage
          );
        });
    } else {
      if (this.listMode == PageListMode.table)
        await this.tableService.searchData(1, (page) => {
          this.tableService.eventTable.initPagination(
            page,
            async (index) => {
              await this.tableService.searchData(index);
            },
            !this.isPage
          );
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.searchDataX(1, (page) => {
          this.tableService.eventCards.initPagination(
            page,
            async (index) => {
              await this.tableService.searchDataX(index);
            },
            !this.isPage
          );
        });
    }
  }

  changeListMode(mode: PageListMode) {
    if (this.listMode != mode) {
      this.listMode = mode;
      this.listTypeView = false;
      this.fillMode.pageListMode = mode;
      this.initTableList();
    }
  }

  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 50);
  }

  async search() {
    this.tableService.search.state = true;
    if (this.listMode == PageListMode.table)
      await this.tableService.searchData(1, (page) => {
        this.tableService.eventTable.initPagination(
          page,
          async (index) => {
            await this.tableService.searchData(index);
          },
          !this.isPage
        );
      });
    else if (this.listMode == PageListMode.list)
      await this.tableService.searchDataX(1, (page) => {
        this.tableService.eventCards.initPagination(
          page,
          async (index) => {
            await this.tableService.searchDataX(index);
          },
          !this.isPage
        );
      });
    this.tableService.allEventsRecordData();
  }
}

export enum ContentModeEnum {
  View,
  Page,
}

export enum OtherViewEnum {
  event,
  info,
}
