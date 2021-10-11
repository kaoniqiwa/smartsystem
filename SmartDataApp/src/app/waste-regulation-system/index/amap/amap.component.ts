import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  ResourceMediumRequestService,
  StationResourceSRServersRequestService,
} from "../../../data-core/repuest/resources.service";
import {
  GarbageStation,
  GetGarbageStationsParams,
} from "../../../data-core/model/waste-regulation/garbage-station";
import {
  GarbageStationCameraRequestService as GarbageStationCameraRequestService,
  GarbageStationRequestService,
} from "../../../data-core/repuest/garbage-station.service";
import {
  GetPreviewUrlParams,
  GetVodUrlParams,
} from "../../../data-core/model/aiop/video-url";
import {
  PlayModeEnum,
  VideoWindowComponent,
} from "../../../video-window/video-window.component";

import { AMapService } from "./amap.service";
import { DivisionRequestService } from "../../../data-core/repuest/division.service";
import {
  Division,
  GetDivisionsParams,
} from "../../../data-core/model/waste-regulation/division";
import { PagedList } from "../../../data-core/model/page";
import { MapListItem, MapListItemType } from "./map-list-panel/map-list-item";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { SessionUser } from "../../../common/tool/session-user";
import { GetGarbageStationStatisticNumbersParams } from "../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { StationState } from "../../../data-core/model/enum";
import { EnumHelper } from "src/app/common/tool/enum-helper";

declare var $: any;

enum PanelEventType {
  Hover,
  Click,
  DoubleClick,
}
@Component({
  selector: "app-amap",
  templateUrl: "./amap.component.html",
  styleUrls: ["./amap.component.css"],
  providers: [AMapService],
})
export class AMapComponent implements AfterViewInit, OnInit {
  @ViewChild("iframe") iframe!: ElementRef;
  @ViewChild("videoWindow")
  videoWindow!: VideoWindowComponent;

  @ViewChild("villageTreeList")
  villageTreeList: any;

  @ViewChild("video_list_prev") video_list_prev!: ElementRef;
  @ViewChild("video_list_next") video_list_next!: ElementRef;

  @Output()
  mapLoadedEvent: EventEmitter<CesiumMapClient> = new EventEmitter();
  @Output()
  patrolButtonClicked: EventEmitter<void> = new EventEmitter();
  @Output()
  vsButtonClicked: EventEmitter<void> = new EventEmitter();
  @Output()
  mapPanelListItemClickedEvent: EventEmitter<
    MapListItem<Division | GarbageStation>
  > = new EventEmitter();

  @Output()
  /**
   * ContextMenu 乱扔垃圾事件
   *
   * @type {EventEmitter<string>}
   * @memberof AMapComponent
   */
  ContextMenuIllegalDropClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();
  @Output()
  /**
   * ContextMenu 混合投放事件
   *
   * @type {EventEmitter<string>}
   * @memberof AMapComponent
   */
  ContextMenuMixedIntoClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();
  @Output()
  /**
   * ContextMenu 投放点巡检事件
   *
   * @type {EventEmitter<string>}
   * @memberof AMapComponent
   */
  ContextMenuStationPatrolClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();
  @Output()
  /**
   * ContextMenu 小包垃圾落地
   *
   * @type {EventEmitter<string>}
   * @memberof AMapComponent
   */
  ContextMenuGarbageCountClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  ContextMenuStationInformationClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  StateClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  GarbageCountClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  IllegalDropClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  MixedIntoClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  labelNumber = 0;
  labels: Global.Dictionary<CesiumDataController.LabelOptions> = {};
  labelHandle: NodeJS.Timer;
  // label 显示
  labelVisibility = false;
  set LabelVisibility(val: boolean) {
    this.labelVisibility = val;
    if (val) {
      this.client.Label.Show();
      this.setLabel(this.garbages);
    } else {
      this.client.Label.Hide();
      this.StationVisibilityByLabel = true;
    }
  }
  get LabelVisibility() {
    return this.labelVisibility;
  }

  // 当显示垃圾落地时长的时候，是否显示其他厢房
  private stationVisibilityByLabel = true;
  get StationVisibilityByLabel() {
    return this.stationVisibilityByLabel;
  }
  set StationVisibilityByLabel(val: boolean) {
    //if (this.stationVisibilityByLabel === val) return;
    this.stationVisibilityByLabel = val;
    if (this.garbages) {
      this.garbages.forEach((x) => {
        this.client.Point.SetVisibility(x.Id, val);
      });
    }
  }

  isShowVideoView = false;
  currentCamera: Camera;
  maskLayerShow = false;
  selectedCameras: Camera[];
  garbages: GarbageStation[];
  dropGarbageStation: GarbageStation[] = [];
  private selectedVillageId?: string;
  showVideoWindow = false;
  selectedGarbageStation?: GarbageStation;

  get Resource() {
    if (this.user.userDivision && this.user.userDivision.length > 0) {
      return this.user.userDivision[0];
    }
    return undefined;
  }

  villageGarbages: GarbageStation[];

  private baseDivisionId: string;
  private points: Global.Dictionary<CesiumDataController.Point> = {};

  panelEventType?: PanelEventType;
  srcUrl: any;
  dataController: CesiumDataController.Controller;
  client: CesiumMapClient;
  user = new SessionUser();
  autoCloseWindowHandle: NodeJS.Timer;
  constructor(
    private amapService: AMapService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private garbageService: GarbageStationRequestService,
    private divisionService: DivisionRequestService,
    private mediaService: ResourceMediumRequestService,
    private cameraService: GarbageStationCameraRequestService,
    private srService: StationResourceSRServersRequestService
  ) {
    this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());
    // this.eventService.pushIllegalDrop.subscribe(async (event: IllegalDropEventRecord) => {
    //     const response = await this.garbageService.get(event.Data.StationId).toPromise();
    //     const status = {
    //         id: event.Data.StationId,
    //         status: 0
    //     };
    //     if (response.Data.DryFull || response.Data.WetFull) {
    //         status.status = 1;
    //     }
    //     this.client.Point.Status([status]);
    // });
    setInterval(() => {
      this.refresh();
    }, 1 * 60 * 1000);
  }

  getSrc() {
    const host = document.location.hostname;
    const port = document.location.port;
    return (
      "http://" +
      host +
      ":" +
      port +
      "/amap/map_ts.html?v=" +
      new Date().format("yyyyMMddHHmmss")
    );
  }

  async refresh() {
    let params = new GetGarbageStationsParams();
    params.PageSize = 9999;
    const response = await this.garbageService.list(params);

    this.garbages = response.Data;
    if (!this.villageGarbages) {
      this.villageGarbages = this.garbages;
    }
    this.setPointStatus(this.garbages);

    if (this.LabelVisibility) {
      this.setLabel(this.garbages).then(() => {
        this.StationVisibilityByLabel = this.StationVisibilityByLabel;
        setTimeout(() => {
          this.StationVisibilityByLabel = this.StationVisibilityByLabel;
        }, 4 * 1000);
      });
    }
  }

  async setLabel(
    stations: GarbageStation[],
    test?: {
      id?: string;
      value?: number;
    }
  ) {
    const params = new GetGarbageStationStatisticNumbersParams();
    params.PageSize = 9999;
    params.Ids = stations.map((x) => x.Id);
    const list = await this.garbageService.statisticNumberList(params);

    if (test) {
      for (let i = 0; i < list.Data.length; i++) {
        if (list.Data[i].Id === test.id) {
          list.Data[i].CurrentGarbageTime = test.value;
          this.testName = list.Data[i].Name;
          break;
        }
      }
    }

    let dropIds = list.Data.filter((x) => {
      return x.CurrentGarbageTime > 0;
    }).map((x) => {
      return x.Id;
    });

    this.dropGarbageStation = stations.filter((x) => dropIds.includes(x.Id));

    const opts = new Array();
    for (let i = 0; i < list.Data.length; i++) {
      const data = list.Data[i];
      const station = stations.find((x) => x.Id == data.Id);

      if (data.CurrentGarbageTime > 0) {
        let point = this.points[data.Id];
        if (!point) {
          point = this.client.DataController.Village.Point.Get(
            station.DivisionId,
            station.Id
          );
          this.points[point.id] = point;
        }
        if (!point) continue;
        const opt = new CesiumDataController.LabelOptions();
        opt.position = point.position;
        opt.id = point.id;

        let p = data.CurrentGarbageTime / 240;
        p = p > 1 ? 1 : p;

        const hours = parseInt((data.CurrentGarbageTime / 60).toString());
        const minutes = parseInt(
          (Math.ceil(data.CurrentGarbageTime) % 60).toString()
        );

        opt.text = hours ? hours + "小时" : minutes ? minutes + "分钟" : "";

        const color = new CesiumDataController.Color();
        color.rgb = "#36e323";
        color.hsl = new CesiumDataController.HSL();
        color.hsl.h = 120 - parseInt((p * 90).toString());
        color.hsl.s = 100;
        color.hsl.l = 60;

        opt.color = color;
        opt.value = p;
        if (opt.text) {
          opt.image = new CesiumDataController.ImageOptions();
          opt.image.color = color;
          opt.image.value = p;
          opt.image.resource = CesiumDataController.ImageResource.arcProgress;
        }
        opts.push(opt);
        this.labels[opt.id] = opt;
      }
    }

    const ids = opts.map((x) => x.id);

    this.client.Label.Set(opts);
    for (const id in this.labels) {
      if (Object.prototype.hasOwnProperty.call(this.labels, id)) {
        const label = this.labels[id];
        if (label.value === 0 || !ids.includes(id)) {
          this.client.Label.Remove(id);
          delete this.labels[id];
        }
      }
    }
  }

  setPointStatus(stations: GarbageStation[]) {
    const arrayStatus = new Array();
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      try {
        const status = {
          id: station.Id,
          status: 0,
        };
        if (station.StationStateFlags.contains(StationState.Error)) {
          status.status = StationState.Error;
        } else if (station.StationStateFlags.contains(StationState.Full)) {
          status.status = StationState.Full;
        } else {
          status.status = 0;
        }

        arrayStatus.push(status);
      } catch (ex) {
        console.error(ex);
      }
    }
    // console.log(arrayStatus);
    this.client.Point.Status(arrayStatus);
  }

  async getBaseDivision() {
    const params = new GetDivisionsParams();
    params.PageSize = 9999;
    params.DivisionType = EnumHelper.Convert(this.Resource.ResourceType);

    const response = await this.divisionService.get(this.Resource.Id);
    if (response) {
      return response;
    }
  }

  ngOnInit() {
    // Detect effects of NgForTrackBy
    this.client = new CesiumMapClient(this.iframe.nativeElement);
    this.client.Events.OnLoading = async () => {
      this.dataController = this.client.DataController;
      let params = new GetGarbageStationsParams();
      params.PageSize = 9999;
      const response = await this.garbageService.list(params);

      this.garbages = response.Data;
      if (!this.villageGarbages) {
        this.villageGarbages = this.garbages;
      }

      for (let i = 0; i < this.garbages.length; i++) {
        const point = this.dataController.Village.Point.Get(
          this.garbages[i].DivisionId,
          this.garbages[i].Id
        );
        if (point) {
          this.points[point.id] = point;
          if (point.name !== this.garbages[i].Name) {
            point.name = this.garbages[i].Name;
            this.dataController.Village.Point.Update(
              this.garbages[i].DivisionId,
              this.garbages[i].Id,
              point
            );
          }
        }
      }
    };
    this.client.Events.OnLoaded = async () => {
      console.log("this.client.Events.OnLoaded");

      setTimeout(() => {
        if (this.mapLoadedEvent) {
          this.mapLoadedEvent.emit(this.client);
        }
      }, 0);

      const p = this.getBaseDivision();
      p.then((baseDivision) => {
        if (!baseDivision) return;
        this.baseDivisionId = baseDivision.Id;
        this.client.Village.Select(baseDivision.Id, true);
        this.refresh();

        const village = this.dataController.Village.Get(baseDivision.Id);
        this.client.Viewer.Focus(village.id);
      });

      this.LabelVisibility = false;

      this.client.ContextMenu.AddItem(
        '<i class="howell-icon-nolittering" style="font-size: 18px"></i> 乱扔垃圾记录',
        async (id: string) => {
          this.client.Events.OnElementsClicked(null);
          if (this.ContextMenuIllegalDropClickedEvent) {
            let station = this.garbages.find((x) => x.Id === id);
            if (!station) {
              const station = await this.garbageService.get(id);
              this.garbages.push(station);
            }
            this.ContextMenuIllegalDropClickedEvent.emit(station);
          }
        },
        0
      );
      this.client.ContextMenu.AddItem(
        '<i class="howell-icon-mixlittering" style="font-size: 18px"></i> 混合投放记录',
        async (id: string) => {
          this.client.Events.OnElementsClicked(null);
          if (this.ContextMenuMixedIntoClickedEvent) {
            let station = this.garbages.find((x) => x.Id === id);
            if (!station) {
              const station = await this.garbageService.get(id);
              this.garbages.push(station);
            }
            this.ContextMenuMixedIntoClickedEvent.emit(station);
          }
        },
        1
      );
      this.client.ContextMenu.AddItem(
        '<i class="howell-icon-garbagebags" style="font-size: 18px"></i> 小包垃圾落地',
        async (id: string) => {
          this.client.Events.OnElementsClicked(null);
          if (this.ContextMenuGarbageCountClickedEvent) {
            let station = this.garbages.find((x) => x.Id === id);
            if (!station) {
              const station = await this.garbageService.get(id);
              this.garbages.push(station);
            }
            this.ContextMenuGarbageCountClickedEvent.emit(station);
          }
        },
        2
      );

      this.client.ContextMenu.AddItem(
        '<i class="howell-icon-Subsystem" style="font-size: 18px"></i> 投放点信息',
        async (id: string) => {
          this.client.Events.OnElementsClicked(null);
          const status = document.getElementsByClassName(
            "map-bar status"
          )[0] as HTMLElement;
          status["style"].display = "none";
          let station = this.garbages.find((x) => x.Id === id);
          if (!station) {
            const station = await this.garbageService.get(id);
            this.garbages.push(station);
          }
          this.selectedGarbageStation = station;

          if (this.ContextMenuStationInformationClickedEvent) {
            this.ContextMenuStationInformationClickedEvent.emit(station);
          }
        },
        3
      );
      this.client.ContextMenu.AddItem(
        '<i class="howell-icon-video" style="font-size: 18px"></i> 投放点视频',
        (id: string) => {
          this.showGarbageStationCameraList(id);
        },
        4
      );

      this.client.ContextMenu.Enable();
    };

    this.client.Events.OnMouseClick = async (position) => {
      console.log("OnMouseClick");
    };
    this.client.Events.OnMouseDoubleClick = async (position) => {
      console.log("OnMouseDoubleClick");
    };

    this.client.Events.OnElementsDoubleClicked = async (objs) => {
      if (!objs || objs.length <= 0) {
        return;
      }
      const id = objs[0].id;
      this.showGarbageStationCameraList(id);
    };

    this.video_list_prev.nativeElement.onclick = () => {
      $(".ul")[0].onwheel({ deltaY: -1 });
    };

    this.video_list_next.nativeElement.onclick = () => {
      $(".ul")[0].onwheel({ deltaY: 1 });
    };

    this.client.Events.OnElementsClicked = (objs) => {
      const status = document.getElementsByClassName("map-bar status")[0];
      status["style"].display = "";

      const list = document.getElementsByClassName("map-bar video-list")[0];
      list["style"].display = "none";

      const prev = document.getElementsByClassName("carousel-control-prev")[0];
      prev["style"].display = "none";
      const next = document.getElementsByClassName("carousel-control-next")[0];
      next["style"].display = "none";
      this.selectedGarbageStation = undefined;
    };

    this.client.Events.OnVillageClicked = async (
      village: CesiumDataController.Village
    ) => {
      if (!village) {
        return;
      }
      this.selectedVillageId = village.id;
      if (this.panelEventType === PanelEventType.Hover) {
        return;
      }

      const status = document.getElementsByClassName("map-bar status")[0];
      status["style"].display = "";

      const list = document.getElementsByClassName("map-bar video-list")[0];
      list["style"].display = "none";

      const prev = document.getElementsByClassName("carousel-control-prev")[0];
      prev["style"].display = "none";
      const next = document.getElementsByClassName("carousel-control-next")[0];
      next["style"].display = "none";

      let params: GetDivisionsParams | GetGarbageStationsParams;
      let response: PagedList<Division | GarbageStation>;

      params = new GetDivisionsParams();
      params.PageSize = 9999;
      params.ParentId = village.id;
      response = await this.divisionService.list(params);
      console.log(response);
      let itemType: MapListItemType;
      let parentId = village.parentId;
      if (response.Page.TotalRecordCount > 0) {
        this.amapService.childrenOfList = (
          response as PagedList<Division>
        ).Data.map((x) => {
          const item = new MapListItem(
            x.Id,
            x.Name,
            MapListItemType.Division,
            x
          );
          itemType =
            item.Data.ParentId === this.Resource.Id
              ? MapListItemType.Parent
              : MapListItemType.Division;
          return item;
        });
      } else {
        params = new GetGarbageStationsParams();
        params.PageSize = 9999;
        (params as GetGarbageStationsParams).DivisionId = village.id;
        response = await this.garbageService.list(
          params as GetGarbageStationsParams
        );
        this.amapService.childrenOfList = (
          response as PagedList<GarbageStation>
        ).Data.map((x) => {
          return new MapListItem(
            x.Id,
            x.Name,
            MapListItemType.GarbageStation,
            x
          );
        });
        itemType = MapListItemType.Division;
      }
      if (!parentId) {
        parentId = await (await this.divisionService.get(village.id)).ParentId;
      }
      switch (itemType) {
        case MapListItemType.Division:
        case MapListItemType.GarbageStation:
          const parent = new MapListItem(parentId, "上一级", itemType, null);
          this.amapService.childrenOfList.unshift(parent);
          break;
        case MapListItemType.Parent:
        default:
          break;
      }
    };
    this.client.Events.OnPointVisibieChanged = (
      pointId: string,
      value: boolean
    ) => {
      if (this.stationVisibilityByLabel == false) {
        try {
          let station = this.dropGarbageStation.find((x) => x.Id === pointId);
          if (!station) return;
        } catch (ex) {
          return;
        }
        if (value === false) {
          this.client.Point.SetVisibility(pointId, true);
        }
      }
    };
  }
  ngAfterViewInit() {}

  async showGarbageStationCameraList(id: string) {
    const list = document.getElementsByClassName(
      "map-bar video-list"
    )[0] as HTMLElement;

    try {
      const response = await this.cameraService.list(id);
      const datas = response.sort((a, b) => {
        return a.Name.length - b.Name.length || a.Name.localeCompare(b.Name);
      });

      this.selectedCameras = [];
      for (let i = 0; i < datas.length; i++) {
        try {
          const camera = datas[i];
          if (camera) {
            if (camera.ImageUrl) {
              camera.ImageUrl = await this.mediaService.getData(
                camera.ImageUrl
              );
            } else {
              camera.ImageUrl = "assets/img/timg.png";
            }
            this.selectedCameras.push(camera);
          }
        } catch (ex) {
          console.error(ex);
        }
      }

      if (this.selectedCameras.length > 5) {
        this.video_list_next.nativeElement.style.display = "";
        this.video_list_prev.nativeElement.style.display = "";
      } else {
        this.video_list_next.nativeElement.style.display = "none";
        this.video_list_prev.nativeElement.style.display = "none";
      }

      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    } catch (ex) {
      console.error(ex);
    } finally {
      list["style"].display = "block";
      const status = document.getElementsByClassName(
        "map-bar status"
      )[0] as HTMLElement;
      status["style"].display = "none";
    }

    $(".ul").each(function (index, element) {
      element.onwheel = function (event) {
        const table = $(element).parents(".video-list");
        const right = $(element).width() - table[0].offsetWidth;
        if (table.scrollLeft() <= right && event.deltaY > 0) {
          // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
          if (event.preventDefault) {
            event.preventDefault();
          }
          const left = table.scrollLeft() + 50;
          table.scrollLeft(left);
        }
        if (table.scrollLeft() >= 0 && event.deltaY < 0) {
          // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
          if (event.preventDefault) {
            event.preventDefault();
          }
          const left = table.scrollLeft() - 50;
          table.scrollLeft(left);
        }
      };
    });
  }

  OnImageError(evt: Event) {
    (evt.currentTarget as HTMLImageElement).src = "assets/img/timg.png";
  }

  OnVillageWindowClosed() {
    if (this.autoCloseWindowHandle) {
      clearTimeout(this.autoCloseWindowHandle);
    }
    this.videoWindow.changePlayMode(PlayModeEnum.live, true);
    this.showVideoWindow = false;
  }

  async OnCameraClicked(camera: Camera) {
    if (!camera) {
      return;
    }

    this.showVideoWindow = true;

    setTimeout(async () => {
      try {
        this.videoWindow.initTime();
        this.videoWindow.changePlayMode(PlayModeEnum.live, true);

        this.currentCamera = camera;
        this.maskLayerShow = true;
        this.isShowVideoView = true;

        console.log(camera);
        const params = new GetPreviewUrlParams();
        params.CameraId = camera.Id;
        params.Protocol = "ws-ps";
        params.StreamType = this.videoWindow.stream;
        const response = await this.srService.PreviewUrls(params);

        this.amapService.videoPlayerService.playCameraName = camera.Name;
        this.amapService.videoPlayerService.playMode = PlayModeEnum.live;
        this.amapService.videoPlayerService.playVideoVideoId = "player";

        response.Data.Url =
          response.Data.Url.indexOf("password") > 0
            ? response.Data.Url
            : response.Data.Url + this.user.videoUserPwd;

        this.amapService.videoPlayerService.url = response.Data.Url;
        this.amapService.videoPlayerService.webUrl = response.Data.WebUrl;
        this.videoWindow.url = response.Data.Url;
        this.videoWindow.WebUrl = response.Data.WebUrl;
        this.videoWindow.cameraName = camera.Name;
        this.videoWindow.playVideo();
      } catch (ex) {
        console.error(ex);
      }
    }, 10);
  }

  Playback(camera: Camera, begin: Date, end: Date) {
    if (!camera) {
      return;
    }

    this.showVideoWindow = true;

    setTimeout(() => {
      this.videoWindow.changePlayMode(PlayModeEnum.vod, false);
      this.currentCamera = camera;
      this.videoWindow.date = begin.format("yyyy-MM-dd");
      this.videoWindow.setBeginTime(begin);
      this.videoWindow.setEndTime(end);
      this.PlaybackClicked({ begin: begin, end: end });
    }, 10);
  }

  autoCloseWindow() {
    if (this.autoCloseWindowHandle) {
      clearTimeout(this.autoCloseWindowHandle);
    }
    this.autoCloseWindowHandle = setTimeout(() => {
      this.videoWindow.closeWindow();
    }, 5 * 60 * 1000);
  }

  async changePlayMode(mode: PlayModeEnum) {
    try {
      if (this.autoCloseWindowHandle) {
        clearTimeout(this.autoCloseWindowHandle);
      }

      this.videoWindow.playMode = mode;
      if (mode === PlayModeEnum.live) {
        const params = new GetPreviewUrlParams();
        params.CameraId = this.currentCamera.Id;
        params.Protocol = "ws-ps";
        params.StreamType = 1;
        const response = await this.srService.PreviewUrls(params);
        response.Data.Url =
          response.Data.Url.indexOf("password") > 0
            ? response.Data.Url
            : response.Data.Url + this.user.videoUserPwd;
        this.videoWindow.url = response.Data.Url;
        this.videoWindow.WebUrl = response.Data.WebUrl;
        this.videoWindow.cameraName = this.currentCamera.Name;
        this.videoWindow.playVideo();
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  async PlaybackClicked(opts: { begin: Date; end: Date }) {
    try {
      const params = new GetVodUrlParams();
      params.BeginTime = opts.begin;
      params.EndTime = opts.end;
      params.Protocol = "ws-ps";
      params.StreamType = 1;
      params.CameraId = this.currentCamera.Id;
      const response = await this.srService.VodUrls(params);
      response.Data.Url =
        response.Data.Url.indexOf("password") > 0
          ? response.Data.Url
          : response.Data.Url + this.user.videoUserPwd;
      this.videoWindow.url = response.Data.Url;
      this.videoWindow.WebUrl = response.Data.WebUrl;
      this.videoWindow.cameraName = this.currentCamera.Name;
      this.videoWindow.playVideo();
    } catch (ex) {
      console.error(ex);
    }
  }

  OnVideoPlaying(playing: boolean) {
    console.log("OnVideoPlaying", playing);
    if (playing) {
      this.autoCloseWindow();
    }
  }

  OnPanelItemClicked(item: MapListItem<Division | GarbageStation>) {
    if (!item) {
      return;
    }
    this.panelEventType = PanelEventType.Click;

    switch (item.type) {
      case MapListItemType.Parent:
      case MapListItemType.Division:
        const village = this.dataController.Village.Get(item.Id);
        this.client.Village.Select(
          village.id,
          this.baseDivisionId === village.id
        );
        //position = village.center;
        this.client.Viewer.Focus(village.id);
        break;
      case MapListItemType.GarbageStation:
        try {
          const point = this.dataController.Village.Point.Get(
            (item.Data as GarbageStation).DivisionId,
            item.Id
          );
          this.client.Viewer.MoveTo(point.position);
          this.client.Point.Select(point.id);
        } catch (ex) {}
        break;
      default:
        return;
    }
    if (this.mapPanelListItemClickedEvent) {
      this.mapPanelListItemClickedEvent.emit(item);
    }
  }

  OnPanelItemDoubleClicked(item: MapListItem<Division | GarbageStation>) {
    if (!item) {
      return;
    }
    this.panelEventType = PanelEventType.DoubleClick;
    switch (item.type) {
      case MapListItemType.GarbageStation:
        const data = item.Data as GarbageStation;
        const point = this.dataController.Village.Point.Get(
          data.DivisionId,
          data.Id
        );
        this.client.Events.OnElementsDoubleClicked([point]);
        break;
      default:
        break;
    }
  }

  OnSearching(text: string) {
    if (!text) return;
    let params = new GetGarbageStationsParams();
    params.Name = text;
    params.PageSize = 999;
    let response = this.garbageService.list(params);
    response.then((garbages) => {
      let list = garbages.Data.map((x) => {
        return new MapListItem(x.Id, x.Name, MapListItemType.GarbageStation, x);
      });
      this.amapService.childrenOfList = list;
    });
  }

  OnPanelItemHover(item: MapListItem<Division | GarbageStation>) {
    return;
    if (!item) {
      return;
    }
    this.panelEventType = PanelEventType.Hover;
    let position: CesiumDataController.Position;

    switch (item.type) {
      case MapListItemType.Parent:
      case MapListItemType.Division:
        const village = this.dataController.Village.Get(item.Id);
        this.client.Village.Select(
          village.id,
          this.baseDivisionId === village.id
        );
        position = village.center;
        break;
      case MapListItemType.GarbageStation:
        try {
          const point = this.dataController.Village.Point.Get(
            (item.Data as GarbageStation).DivisionId,
            item.Id
          );
          position = point.position;
        } catch (ex) {}
        break;
      default:
        return;
    }
    // if (position) {
    //     this.client.Viewer.MoveTo(position);
    // }
  }

  VisibilityChange() {}

  OnPanelVisibilityChanged(visibility: boolean) {}

  MapReload() {
    const id = this.selectedVillageId;
    if (this.baseDivisionId) {
      this.client.Village.Reload(this.baseDivisionId);
      this.client.Village.Select(this.baseDivisionId, true);
      this.refresh();
      if (id) {
        this.client.Village.Select(id);
      }
    }
  }

  Button1Clicked() {
    if (this.patrolButtonClicked) {
      this.patrolButtonClicked.emit();
    }
  }
  Button2Clicked() {
    if (this.vsButtonClicked) {
      this.vsButtonClicked.emit();
    }
  }

  Button3Clicked() {
    this.LabelVisibility = !this.LabelVisibility;
  }

  VillageSelect(villageId: string, move: boolean) {
    this.client.Village.Select(villageId, this.baseDivisionId === villageId);
    if (move) {
      const village = this.dataController.Village.Get(villageId);
      this.client.Viewer.Focus(villageId);
      // this.client.Viewer.MoveTo(village.center);
    }
  }

  MoveToByGarbageStation(station: GarbageStation) {
    let point = this.points[station.Id];
    if (!point) {
      point = this.dataController.Village.Point.Get(
        station.DivisionId,
        station.Id
      );
    }
    this.client.Viewer.MoveTo(point.position);
  }

  async onVideoWindowDownload(args: { begin: Date; end: Date }) {
    if (!this.currentCamera) {
      return;
    }
    const interval = args.end.getTime() - args.begin.getTime();

    if (interval > 5 * 60 * 1000) {
      args.end.setTime(args.begin.getTime() + 5 * 1000 * 60);
    }

    const response = this.garbageService.cameraFileUrl(
      this.currentCamera.GarbageStationId,
      this.currentCamera.Id,
      args.begin.toISOString(),
      args.end.toISOString()
    );
    response.then((data) => {
      if (data && data.Url) {
        const a = document.createElement("a");
        a.href = data.Url;
        a.click();
        document.body.appendChild(a);
        document.body.removeChild(a);
      }
    });
  }

  ChangePointInfoPanelVisibility() {}

  Button4Clicked() {
    this.StationVisibilityByLabel = !this.StationVisibilityByLabel;
  }
  testValue = 0;
  testName = "";
  ButtonTestClicked() {
    this.testValue++;
    console.log("testValue:", this.testValue);
    this.setLabel(this.garbages, {
      id: this.garbages[0].Id,
      value: this.testValue % 2,
    }).then(() => {
      this.StationVisibilityByLabel = this.StationVisibilityByLabel;
      setTimeout(() => {
        this.StationVisibilityByLabel = this.StationVisibilityByLabel;
      }, 5000);
    });
  }

  onPanelStateClicked(station: GarbageStation) {
    if (station.StationStateFlags.contains(StationState.Error)) {
      this.selectedGarbageStation = undefined;
      this.showGarbageStationCameraList(station.Id);
    }
    if (this.StateClickedEvent) {
      this.StateClickedEvent.emit(station);
    }
  }

  onPanelGarbageCountClicked(station: GarbageStation) {
    if (this.GarbageCountClickedEvent) {
      this.GarbageCountClickedEvent.emit(station);
    }
  }

  onPanelIllegalDropClicked(station: GarbageStation) {
    if (this.IllegalDropClickedEvent) {
      this.IllegalDropClickedEvent.emit(station);
    }
  }

  onPanelMixedIntoClicked(station: GarbageStation) {
    if (this.MixedIntoClickedEvent) {
      this.MixedIntoClickedEvent.emit(station);
    }
  }
}
