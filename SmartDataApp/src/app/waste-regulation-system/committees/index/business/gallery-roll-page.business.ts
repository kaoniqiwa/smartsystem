import { EventEmitter } from "@angular/core";
import { HWSPlayerOptions } from "src/app/common/directive/wsplayer-directive";
import { Language } from "src/app/common/tool/language";
import { MessageBar } from "src/app/common/tool/message-bar";
import { OnlineStatus } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import {
  Gallery,
  GalleryImage,
  GalleryRollPage,
  GetPictureButtonArgs,
  PlaybackGallery,
} from "src/app/shared-module/card-component/gallery-roll-page/gallery-roll-page";
import { IGalleryRollPageConfig } from "src/app/shared-module/card-component/gallery-roll-page/gallery-roll-page.config";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";
import { PlaybackViewModel } from "../../playback-config/playback-config.model";
import { WindowOperationBussiness } from "./window-operation.business";

export class GalleryRollPageBusiness {
  constructor(
    private window: WindowOperationBussiness,
    private stationService: GarbageStationRequestService
  ) {
    window.playback.onOkClicked.subscribe((x: PlaybackViewModel) => {
      this.playbackGallery.begin = x.begin;
      this.playbackGallery.end = x.end;
      this.playbackTrigger.emit(this.playbackGallery);
    });

    GlobalStoreService.change.subscribe((station: GarbageStation) => {
      for (const value of this.Model.items.values()) {
        if (value.title.id === station.Id) {
          if (this.Model.index !== value.i) {
            this.Model.index = value.i;
          }
          return;
        }
      }
    });
  }
  playbackGallery: PlaybackGallery = new PlaybackGallery();
  playbackTrigger: EventEmitter<PlaybackGallery> = new EventEmitter();

  Config: IGalleryRollPageConfig = {
    closeButtonVisibility: false,
    titleVisibility: false,
    statusBarVisibility: false,
    videoControlFullscreenVisibility: false,
    playVideoToBig: true,
    autoRefreshVisibility: false,
    autoGetPicture: false,
    playbackButtonVisibility: true,
  };
  Model: GalleryRollPage;
  Converter = new GalleryRollPageConverter();

  changeStation: EventEmitter<string> = new EventEmitter();

  async load(stations: GarbageStation[]) {
    // let params = new GetPreviewUrlParams()
    // params.CameraId =
    // let preview = await this.sr.preview(params)

    this.Model = this.Converter.Convert(stations);
  }

  onNextGroupClicked(model: Gallery) {
    console.log(model);
    if (model) {
      this.changeStation.emit(model.title.id);
    }
  }
  onPreviousGroupClicked(model: Gallery) {
    console.log(model);
    if (model) {
      this.changeStation.emit(model.title.id);
    }
  }
  async onGetPictureClicked(item: GetPictureButtonArgs) {
    const state = (gs: GarbageStation) => {
      return Language.StationStateFlags(gs.StationStateFlags);
      // if (gs.StationState == 0) return "正常";
      // else if (
      //   enumHelper.stationState.err.indexOf(gs.StationState) > -1
      // )
      //   return "异常";
      // else if (
      //   enumHelper.stationState.full.indexOf(gs.StationState) > -1
      // )
      //   return "满溢";
    };
    if (item.g && item.g.title) {
      /**更新投放点 */
      const station = await this.stationService.get(item.g.title.id);
      if (station) {
        item.g.title.state = state(station);
        station.Cameras.map((m) => {
          if (m.ImageUrl) {
            const desc = item.g.imgDesc.find((i) => i.tag.id == m.Id);
            if (desc)
              desc.src = ResourceMediumRequestService.getData(m.ImageUrl);
          }
        });
      }
      this.stationService.manualCapture(item.g.title.id).then((data) => {
        item.catchState.o = true;
        if (data) {
          data.map((m) => {
            if (m.Result) {
              const desc = item.g.imgDesc.find((i) => i.tag.id == m.CameraId);
              if (desc) desc.src = ResourceMediumRequestService.getData(m.Id);
            }
          });
        }
        if (item.msg) MessageBar.response_success();
      });
    }
  }

  styles: any = {};

  onSizeChangeClicked(maxWindow: boolean) {
    this.styles = maxWindow
      ? {
          position: "fixed",
          right: "5px",
          left: "5px",
          top: "100px",
          zIndex: 1,
          height: "calc(100% - 105px)",
          backgroundColor: "#0a0933",
          border: "1px solid #5c6ebf",
        }
      : {};
  }

  onPlaybackClicked(cameraId: string) {
    this.window.playback.show = true;
    this.playbackGallery.cameraId = cameraId;
  }
}

class GalleryRollPageConverter
  implements ICommitteesConverter<GarbageStation[], GalleryRollPage>
{
  Convert(
    input: GarbageStation[],
    playerOptions?: HWSPlayerOptions
  ): GalleryRollPage {
    let page = new GalleryRollPage();
    page.autoChangePage = true;
    page.index = 1;

    page.items = new Map<number, Gallery>();

    for (let i = 0; i < input.length; i++) {
      const station = input[i];

      page.items.set(i + 1, this.ConvertItem(station, i + 1));
    }

    page.videoOptions = playerOptions;
    return page;
  }

  ConvertItem(input: GarbageStation, index: number): Gallery {
    let gallery = new Gallery();
    gallery.i = index;
    gallery.title = {
      text: input.Name,
      id: input.Id,
      state: Language.StationStateFlags(input.StationStateFlags),
      eventNumber: 0,
    };
    gallery.imgDesc = input.Cameras.map((camera) => {
      return {
        src: ResourceMediumRequestService.getJPG(camera.ImageUrl),
        desc: "",
        tag: { id: camera.Id },
        state: camera.OnlineStatus != OnlineStatus.Online,
      };
    });

    return gallery;
  }
}
