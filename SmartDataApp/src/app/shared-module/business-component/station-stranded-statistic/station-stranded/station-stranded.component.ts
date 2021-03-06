import { Component, OnInit, Input, Output } from "@angular/core";
import { StationStrandedBusinessService } from "./business/station-stranded.business";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { GarbageStationCameraDao } from "../../../../data-core/dao/garbage-station-camera-dao";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { EventEmitter } from "@angular/core";
import { HWVideoService } from "src/app/data-core/dao/video-dao";
// import { HWVideoService } from "../../../../data-core/dao/video-dao";
@Component({
  selector: "hw-station-stranded",
  templateUrl: "./station-stranded.component.html",
  styleUrls: ["./station-stranded.component.styl"],
  providers: [
    DivisionDao,
    GarbageStationDao,
    StationStrandedBusinessService,
    GarbageStationCameraDao,
    HWVideoService,
  ],
})
export class StationStrandedComponent implements OnInit {
  @Output()
  garbageStationMoveToPosition: EventEmitter<GarbageStation> = new EventEmitter();

  private _divisionId?: string;
  public get divisionId(): string | undefined {
    return this._divisionId;
  }
  @Input()
  public set divisionId(v: string | undefined) {
    this._divisionId = v;
    if (this._divisionId) {
      this.onLoaded.subscribe(() => {
        this.search({ divisionId: this._divisionId });
      });
    }
  }

  private garbageStation?: GarbageStation;
  @Input()
  set GarbageStation(station: GarbageStation | undefined) {
    console.log(station);
    this.garbageStation = station;

    this.search({
      stationId: this.garbageStation ? this.garbageStation.Id : undefined,
    });
  }
  get GarbageStation() {
    return this.garbageStation;
  }

  private _garbageStationId?: string;
  public get garbageStationId(): string | undefined {
    return this._garbageStationId;
  }

  @Input()
  public set garbageStationId(v: string | undefined) {
    this._garbageStationId = v;
    if (this._garbageStationId) {
      this.onLoaded.subscribe(() => {
        this.search({ stationId: this._garbageStationId });
      });
    }
  }

  /** ???????????? ??????????????????????????????????????? */
  searchFn = async (val: string) => {
    this.businessService.search.searchText = val;
    this.businessService.search.state = true;
    await this.businessService.requestData(1, undefined, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });
  };

  async search(val?: {
    name?: string;
    stationId?: string;
    divisionId?: string;
  }) {
    this.businessService.search.state = true;
    await this.businessService.requestData(1, val, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index, val);
      });
    });
  }

  galleryTargetFn = () => {
    this.businessService.galleryTargetView.galleryTarget = null;
  };
  // videoClose = () => {
  //   this.businessService.playVideo = null;
  // }

  constructor(
    private businessService: StationStrandedBusinessService,
    // ,private  videoService:HWVideoService
    private garbageStationCameraDao: GarbageStationCameraDao,
    private divisionDao: DivisionDao,
    private garbageStationDao: GarbageStationDao
  ) {
    this.businessService.table.positionButtonClicked.subscribe((id) => {
      let station = this.businessService.stations.find((x) => x.Id === id);
      if (station) {
        this.garbageStationMoveToPosition.emit(station);
      }
    });
  }

  async ngOnInit() {
    //  this.businessService.divisionsId=this.divisionId;

    this.businessService.cameras =
      await this.garbageStationCameraDao.garbageStationCameras();
    this.businessService.stations =
      await this.garbageStationDao.allGarbageStations();
    this.businessService.divisions = await this.divisionDao.allDivisions();

    let param = {
      divisionId: this.divisionId,
      stationId: this.garbageStationId,
    };
    await this.businessService.requestData(1, param, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index, param);
      });
    });
    this.onLoaded.emit();
  }

  onLoaded: EventEmitter<void> = new EventEmitter();

  videoClose = () => {
    this.businessService.playVideo = null;
  };
}
