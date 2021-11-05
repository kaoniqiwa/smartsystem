import { Injectable } from "@angular/core";
import { HWSPlayerOptions } from "src/app/common/directive/wsplayer-directive";
import { Language } from "src/app/common/tool/language";
import { GetPreviewUrlParams } from "src/app/data-core/model/aiop/video-url";
import { Camera } from "src/app/data-core/model/waste-regulation/camera";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  ResourceMediumRequestService,
  ResourceSRServersRequestService,
} from "src/app/data-core/repuest/resources.service";
import { SRServiceRequestSerivce } from "src/app/data-core/repuest/sr-service.service";
import {
  Gallery,
  GalleryRollPage,
} from "src/app/shared-module/card-component/gallery-roll-page/gallery-roll-page";
import {
  GalleryRollPageConfig,
  IGalleryRollPageConfig,
} from "src/app/shared-module/card-component/gallery-roll-page/gallery-roll-page.config";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";

@Injectable()
export class GalleryRollPageBusiness {
  constructor() {
    GlobalStoreService.change.subscribe((station: GarbageStation) => {
      this.Model.items.forEach((x) => {
        if (x.title.id === station.Id) {
          this.Model.index = x.index;
          return;
        }
      });
    });
  }
  Config: IGalleryRollPageConfig = {
    closeButtonVisibility: false,
    refreshButtonVisibility: false,
    fullscreenButtonVisibility: false,
    titleVisibility: false,
    statusBarVisibility: false,
    videoControlFullscreenVisibility: false,
  };
  Model: GalleryRollPage;
  Converter = new GalleryRollPageConverter();

  async load(stations: GarbageStation[]) {
    // let params = new GetPreviewUrlParams()
    // params.CameraId =
    // let preview = await this.sr.preview(params)

    this.Model = this.Converter.Convert(stations);
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
    page.autoChangePage = false;
    page.index = 1;

    page.items = new Map<number, Gallery>();

    for (let i = 0; i < input.length; i++) {
      const station = input[i];

      page.items.set(i + 1, this.ConvertItem(station));
    }

    page.videoOptions = playerOptions;
    return page;
  }

  ConvertItem(input: GarbageStation): Gallery {
    let gallery = new Gallery();
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
        state: !!camera.OnlineStatus,
      };
    });

    return gallery;
  }
}
