import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { CustomTableComponent } from "../../../../shared-module/custom-table/custom-table.component";
import { EventTableService, FillMode } from "./business/event-table.service";
import { PageListMode } from "../../../../common/tool/enum-helper";
import { ImageDesc } from "../../../image-desc-card/image-desc";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
import {
  BusinessManageService,
  ViewDivisionTypeEnum,
} from "../../business-manage-service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { LevelListPanelComponent } from "../level-list-panel/level-list-panel.component";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
import { GetVodUrlParams } from "../../../../data-core/model/aiop/video-url";
import { DivisionType } from "../../../../data-core/model/enum";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
@Component({
  selector: "hw-mixed-into-event-history",
  templateUrl: "./mixed-into-event-history.component.html",
  styleUrls: ["./mixed-into-event-history.component.styl"],
  providers: [EventTableService, HWVideoService],
})
export class MixedIntoEventHistoryComponent implements OnInit, OnDestroy {
  listTypeView = false;
  listMode = PageListMode.table;
  otherView = OtherViewEnum;
  pageListMode = PageListMode;
  @ViewChild("table")
  table: CustomTableComponent;
  @ViewChild(LevelListPanelComponent)
  levelListPanel: LevelListPanelComponent;

  @Input() fillMode: FillMode;
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  };

  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  };
  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
    this.tableService.videoDownLoad = null;
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
    this.tableService.galleryTargetView.initGalleryTarget(event);
  };

  videoClose = () => {
    this.tableService.videoImgs = null;
  };
  constructor(
    private tableService: EventTableService,
    private videoService: HWVideoService,
    private businessManageService: BusinessManageService
  ) {}

  setSearchDivision() {
    if (this.fillMode) {
      const division = this.tableService.divisions.find(
        (d) => d.Id == this.fillMode.divisionId
      );
      if (division && division.DivisionType == DivisionType.City) {
        const children = this.tableService.divisions.filter(
          (f) => f.ParentId == division.Id
        );
        if (children.length > 0) {
          this.tableService.search.divisionId = children[0].Id;
        }
      } else if (
        this.businessManageService.viewDivisionType ==
          ViewDivisionTypeEnum.TableLinkChild &&
        division == null
      ) {
        const station = this.tableService.garbageStations.find(
          (s) => s.Id == this.fillMode.divisionId
        );
        if (station) this.tableService.search.divisionId = station.DivisionId;
      } else this.tableService.search.divisionId = this.fillMode.divisionId;
    } else this.tableService.search.divisionId = "";
  }

  async ngOnInit() {
    this.listMode = this.fillMode
      ? this.fillMode.pageListMode
      : PageListMode.table;
    this.tableService.fillMode = this.fillMode;
    // this.tableService.search.divisionId = this.fillMode ? this.fillMode.divisionId : '';

    if (
      (this.businessManageService.viewDivisionType ==
        ViewDivisionTypeEnum.MapStation ||
        this.businessManageService.viewDivisionType ==
          ViewDivisionTypeEnum.TableLinkChild) &&
      this.businessManageService.station
    ) {
      this.tableService.search.stationId =
        this.businessManageService.station.Id;
    }

    this.tableService.divisions = await this.tableService.requestDivisions();
    this.setSearchDivision();
    this.initTableList();
    // this.tableService.eventTable.tableSelectIds = this.tableSelectIds;

    this.tableService.garbageStations =
      await this.tableService.requestGarbageStations();
    this.tableService.resources = await this.tableService.requestResource();
    this.tableService.search.appendResourcesDropList(
      this.tableService.resources
    );
    this.tableService.search.appendStationsDropList(
      this.tableService.garbageStations
    );
    this.tableService.divisionListView.toLevelListPanel(
      this.tableService.divisions
    );
    this.tableService.allEventsRecordData();

    this.tableService.playVideoToUrlFn = (id, time, cb) => {
      const param = new GetVodUrlParams();
      param.CameraId = id;
      param.BeginTime = new Date(time);
      param.EndTime = new Date(time);
      this.videoService.videoUrl(param).then((t) => cb(t.WebUrl, t.Url));
    };
  }

  ngOnDestroy() {
    this.businessManageService.resetNone();
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
            true
          );
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.requestDataX(1, (page) => {
          this.tableService.eventCards.initPagination(
            page,
            async (index) => {
              await this.tableService.requestDataX(index);
            },
            true
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
            true
          );
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.searchDataX(1, (page) => {
          this.tableService.eventCards.initPagination(
            page,
            async (index) => {
              await this.tableService.searchDataX(index);
            },
            true
          );
        });
    }
  }

  moreSearch() {
    this.tableService.search.other = !this.tableService.search.other;
    if (
      this.businessManageService.viewDivisionType == ViewDivisionTypeEnum.None
    )
      setTimeout(() => {
        if (this.levelListPanel) {
          const division = this.tableService.divisions.find(
            (d) => d.Id == GlobalStoreService.divisionId
          );
          if (division && division.DivisionType == DivisionType.City) {
            const children = this.tableService.divisions.filter(
              (f) => f.ParentId == division.Id
            );
            if (children.length > 0) {
              this.levelListPanel.defaultItem(children[0].Id);
            }
          } else this.levelListPanel.defaultItem(GlobalStoreService.divisionId);
        }
      }, 500);
    else if (
      this.businessManageService.viewDivisionType ==
        ViewDivisionTypeEnum.MapStation &&
      this.businessManageService.station
    ) {
      setTimeout(() => {
        this.levelListPanel.defaultItem(
          this.businessManageService.station.DivisionId
        );
        this.tableService.search.stationId =
          this.businessManageService.station.Id;
      }, 500);
    } else if (
      this.businessManageService.viewDivisionType ==
        ViewDivisionTypeEnum.TableLinkChild &&
      this.fillMode
    ) {
      setTimeout(() => {
        if (this.businessManageService.station) {
          this.levelListPanel.defaultItem(
            this.businessManageService.station.DivisionId
          );
          this.tableService.search.stationId =
            this.businessManageService.station.Id;
        } else this.levelListPanel.defaultItem(this.fillMode.divisionId);
      }, 500);
    }
  }

  changeListMode(mode: PageListMode) {
    this.listMode = mode;
    this.listTypeView = false;
    this.fillMode.pageListMode = mode;
    this.initTableList();
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
        this.tableService.eventTable.initPagination(page, async (index) => {
          await this.tableService.searchData(index);
        });
      });
    else if (this.listMode == PageListMode.list)
      await this.tableService.searchDataX(1, (page) => {
        this.tableService.eventCards.initPagination(page, async (index) => {
          await this.tableService.searchDataX(index);
        });
      });
    await this.tableService.allEventsRecordData();
  }
}
