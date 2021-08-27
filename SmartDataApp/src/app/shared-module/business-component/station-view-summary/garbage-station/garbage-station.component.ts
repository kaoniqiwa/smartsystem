import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BusinessService } from "./business/garbage-station-list.service";
import { GarbageStationSummaryViewPage } from "../view-helper";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
@Component({
  selector: "hw-garbage-station",
  templateUrl: "./garbage-station.component.html",
  providers: [BusinessService, HWVideoService],
})
export class GarbageStationComponent implements OnInit {
  @Output() OtherViewEvent = new EventEmitter<GarbageStationSummaryViewPage>();
  @Output()
  GarbageStationMoveToPosition = new EventEmitter<GarbageStation>();
  @Input() divisionsId = "";
  otherView = GarbageStationSummaryViewPage;
  searchFn = async (val: string) => {
    this.businessService.search.searchText = val;
    this.businessService.search.state = true;
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });
  };

  galleryTargetFn = () => {
    this.businessService.galleryTargetView.galleryTarget = null;
  };
  videoClose = () => {
    this.businessService.playVideo = null;
  };
  constructor(
    private businessService: BusinessService,
    videoService: HWVideoService
  ) {
    this.businessService.videoService = videoService;
    this.businessService.positionClicked = (station: GarbageStation) => {
      if (this.GarbageStationMoveToPosition) {
        this.GarbageStationMoveToPosition.emit(station);
      }
    };
  }

  async ngOnInit() {
    this.businessService.divisionsId = this.divisionsId;
    this.businessService.cameras =
      await this.businessService.resourceCameraDao.allResourceCameras();
    this.businessService.garbageStationTypes =
      await this.businessService.requestGarbageStationType();
    this.businessService.divisions =
      await this.businessService.requestDivisions();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });
  }
  changeOtherView(val: GarbageStationSummaryViewPage) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 240);
  }
}
