import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { Language } from "src/app/common/tool/language";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import {
  Gallery,
  GalleryRollPage,
} from "src/app/shared-module/card-component/gallery-roll-page/gallery-roll-page";
import { GarbageStationInspection } from "../../business/inspection/data";

export class GarbageStationInspectionCardConverter implements IConverter {
  constructor() {}

  Convert<GarbageStationInspection, ViewsModel>(
    input: GarbageStationInspection,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: GarbageStationInspection,
    output: ViewsModel<GalleryRollPage>
  ): ViewsModel<GalleryRollPage> {
    output.views = [];
    output.pageSize = 1;
    output.pageIndex = 1;
    if (input instanceof GarbageStationInspection) {
      const model = new GalleryRollPage();
      model.items = new Map();
      model.leftBottom = {
        text: 0,
      };

      for (let i = 0; i < input.garbageStations.length; i++) {
        const gs = input.garbageStations[i],
          stationEvents = input.todayStationsEvent.filter(
            (x) => x.Data.StationId == gs.Id
          ),
          gallery = new Gallery(),
          state = () => {
            return Language.StationStateFlags(gs.StationStateFlags);
            // if (gs.StationState == 0) return "正常";
            // else if (enumHelper.stationState.err.indexOf(gs.StationState) > -1)
            //   return "异常";
            // else if (enumHelper.stationState.full.indexOf(gs.StationState) > -1)
            //   return "满溢";
          };
        gallery.title = {
          state: state(),
          text: gs.Name,
          id: gs.Id,
          eventNumber: stationEvents.length,
        };
        gallery.imgDesc = new Array();
        gs.Cameras.sort((a, b) => {
          return a.CameraUsage - b.CameraUsage;
        })
          .sort((a, b) => {
            return "".naturalCompare(a.Name, b.Name);
          })
          .map((x) => {
            gallery.imgDesc.push({
              src: ResourceMediumRequestService.getJPG(x.ImageUrl),
              tag: {
                id: x.Id,
              },
              desc: x.Name,
              state: x.OnlineStatus != 0,
            });
          });

        model.items.set(i + 1, gallery);
      }
      output.views = [model];
    }

    return output;
  }
}
