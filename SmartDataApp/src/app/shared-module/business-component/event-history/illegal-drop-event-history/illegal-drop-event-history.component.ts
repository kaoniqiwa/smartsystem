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
import {
  EventTableService,
  IllegalDropEventHistoryFillMode,
} from "./business/illegal-drop-event-table.service";
import { PageListMode } from "../../../../common/tool/enum-helper";
import { ImageDesc } from "../../../image-desc-card/image-desc";
import { Router } from "@angular/router";
import { SideNavService } from "../../../../common/tool/sidenav.service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { SystemModeEnum } from "../../../../common/tool/table-form-helper";
import { LevelListPanelComponent } from "../level-list-panel/level-list-panel.component";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
import {
  BusinessManageService,
  ViewDivisionTypeEnum,
} from "../../business-manage-service";
import { DivisionType } from "../../../../data-core/model/enum";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { Language } from "src/app/common/tool/language";
@Component({
  selector: "hw-illegal-drop-event-history",
  templateUrl: "./illegal-drop-event-history.component.html",
  styleUrls: ["./illegal-drop-event-history.component.styl"],
  providers: [EventTableService],
})
export class IllegalDropEventHistoryComponent implements OnInit, OnDestroy {
  Language = Language;
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

  @Input() fillMode: IllegalDropEventHistoryFillMode;

  /**
   * 用于页面 判断
   */
  @Input() isPage: boolean;
  @Input() changeViewFn: (index: number) => void;

  private _GarbageStation?: GarbageStation;
  public get GarbageStation(): GarbageStation | undefined {
    return this._GarbageStation;
  }
  @Input()
  public set GarbageStation(v: GarbageStation | undefined) {
    this._GarbageStation = v;

    this.tableService.search.stationId = v ? v.Id : undefined;
    this.search();
  }

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
      let city = this.tableService.divisions.find((x) => !x.ParentId);
      if (city) {
        this.changeDivisionFn(city.Id);
      }
      return;
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
    this.tableService.galleryTargetView.galleryTarget.videoName = true;
  };

  videoClose = () => {
    this.tableService.playVideo = null;
  };

  constructor(
    private tableService: EventTableService,
    private navService: SideNavService,
    private businessManageService: BusinessManageService,
    private router: Router
  ) {}

  changeStation(val: string) {
    this.tableService.search.appendResourcesDropList(
      this.tableService.resources.filter((r) => r.GarbageStationId == val)
    );
  }

  ngOnDestroy() {
    this.businessManageService.resetNone();
  }

  setSearchDivision() {
    if (this.fillMode) {
      const division = this.tableService.divisions.find(
        (d) => d.Id == this.fillMode.divisionId
      );
      if (division && division.DivisionType == DivisionType.City) {
        const children = this.tableService.divisions.filter(
          (f) => f.ParentId == division.Id
        );
        this.tableService.search.divisionId = division.Id; //children.pop().Id;
      } else if (
        this.businessManageService.viewDivisionType ==
          ViewDivisionTypeEnum.TableLinkChild &&
        division == null
      ) {
        //id 是投放点的
        const station = this.tableService.garbageStations.find(
          (s) => s.Id == this.fillMode.divisionId
        );
        if (station) {
          this.tableService.search.divisionId = station.DivisionId;
        }
      } else {
        this.tableService.search.divisionId = this.fillMode.divisionId;
      }
    } else {
      this.tableService.search.divisionId = "";
    }
  }
  async ngOnInit() {
    //this.tableService.search.divisionId = this.fillMode ? this.fillMode.divisionId : '';
    this.listMode = this.fillMode
      ? this.fillMode.pageListMode
      : PageListMode.table;
    this.tableService.fillMode = this.fillMode;
    if (this.isPage) {
      this.tableMinusHeight = "calc(100% - 20px)";
      this.tableSearchHeight = "calc(100% - 64px)";
      this.tableService.fillMode = new IllegalDropEventHistoryFillMode();
      this.tableService.fillMode.divisionId = GlobalStoreService.divisionId;

      this.tableService.search.divisionId = GlobalStoreService.divisionId;
    }
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

    let filter = this.tableService.divisions.filter((x) => x.ParentId != null);
    this.tableService.divisionListView.toLevelListPanel(filter);
    await this.tableService.allEventsRecordData();
    //this.allEvallEventsRecord();
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
          // if (division && division.DivisionType == DivisionType.City) {
          //   const children = this.tableService.divisions.filter(
          //     (f) => f.ParentId == division.Id
          //   );
          //   this.levelListPanel.defaultItem(children.pop().Id);
          // } else {
          this.levelListPanel.defaultItem(GlobalStoreService.divisionId);
          // }
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

  goMoreHistroy() {
    this.navService.systemMode = SystemModeEnum.illegalDropEvent;
    this.router.navigateByUrl("aiop/event-history/illegal-drop-event?p=1");
  }

  changeView(tagIndex: number) {
    this.changeViewFn(tagIndex);
  }

  async initTableList() {
    if (this.tableService.search.state == false) {
      if (this.listMode == PageListMode.table) {
        await this.tableService.requestData(1, (page) => {
          this.tableService.eventTable.initPagination(
            page,
            async (index) => {
              await this.tableService.requestData(index);
            },
            !this.isPage
          );
        });
      } else if (this.listMode == PageListMode.list) {
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
      }
    } else {
      if (this.listMode == PageListMode.table) {
        await this.tableService.searchData(1, (page) => {
          this.tableService.eventTable.initPagination(
            page,
            async (index) => {
              await this.tableService.searchData(index);
            },
            !this.isPage
          );
        });
      } else if (this.listMode == PageListMode.list) {
        await this.tableService.searchDataX(1, (page) => {
          this.tableService.eventCards.initPagination(
            page,
            async (index) => {
              await this.tableService.searchDataX(index);
            },
            !this.isPage
          );
        });
      } else {
      }
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
