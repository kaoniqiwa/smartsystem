import { Component, OnInit, Input } from "@angular/core";
import { HWVideoService } from "src/app/data-core/dao/video-dao";
import { OnlineStatus } from "src/app/data-core/model/enum";
import { CameraTableService } from "./business/camera-table.service";

@Component({
  selector: "hw-garbage-station-cameras",
  templateUrl: "./garbage-station-cameras.component.html",
  providers: [CameraTableService, HWVideoService],
  styleUrls: ["./garbage-station-cameras.component.styl"],
})
export class GarbageStationCamerasComponent implements OnInit {
  private _cameraStateTable?: OnlineStatus = undefined;
  public get cameraStateTable(): OnlineStatus | undefined {
    return this._cameraStateTable;
  }
  @Input()
  public set cameraStateTable(v: OnlineStatus | undefined) {
    console.log(v);

    this._cameraStateTable = v;
    this.load();
  }

  @Input() divisionsId = "";
  searchFn = async (text: string) => {
    this.tableService.search.state = true;
    this.tableService.search.searchText = text;
    await this.tableService.requestData(1, (page) => {
      this.tableService.table.initPagination(page, async (index) => {
        await this.tableService.requestData(index);
      });
    });
  };
  constructor(private tableService: CameraTableService) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.tableService.divisionsId = this.divisionsId;
    this.tableService.cameraStateTable = this.cameraStateTable;
    await this.tableService.getGarbageStations();
    await this.tableService.getDivisions();
    await this.tableService.getResourceCameras();
    await this.tableService.requestData(1, (page) => {
      this.tableService.table.initPagination(page, async (index) => {
        await this.tableService.requestData(index);
      });
    });
  }

  videoClose = () => {
    this.tableService.playVideo = null;
  };
  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
  };
}
