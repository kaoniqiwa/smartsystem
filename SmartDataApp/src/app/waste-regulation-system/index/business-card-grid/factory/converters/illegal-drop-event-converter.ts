import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { Language } from "src/app/common/tool/language";
import { SessionUser } from "src/app/common/tool/session-user";
import { DateInterval } from "src/app/common/tool/tool.service";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import { ColorEnum } from "src/app/shared-module/card-component/card-content-factory";
import { ImageTheme } from "src/app/shared-module/card-component/image-theme-card/image-theme";
import { isBoolean } from "util";
import { IllegalDropEventInfos } from "../../business/illegal-drop-event/data";

export class IllegalDropEventConverter implements IConverter {
  constructor() {}

  Convert<IllegalDropEventInfos, ViewsModel>(
    input: IllegalDropEventInfos,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: IllegalDropEventInfos,
    output: ViewsModel<ImageTheme>
  ): ViewsModel<ImageTheme> {
    output.views = [new ImageTheme()];
    output.pageSize = 1;
    output.pageIndex = 1;
    if (input instanceof IllegalDropEventInfos) {
      output.pageSize = input.items.length;
      output.views = new Array();
      const user = new SessionUser();
      for (let i = 0; i < input.items.length; i++) {
        output.views.push(new ImageTheme());

        output.views[i].imgDesc1 = input.items[i].DivisionName;
        output.views[i].imgDesc2 = input.items[i].StationName;
        output.views[i].imgSrc = ResourceMediumRequestService.getJPG(
          input.items[i].ImageUrl
        );
        output.views[i].title = Language.json.EventType.IllegalDrop;
        output.views[i].imgDesc1Icon = "howell-icon-signal2";
        output.views[i].imgDesc1IconColor = ColorEnum["green-text"];
        output.views[i].titleColor = ColorEnum["red-text"];
        output.views[i].subTitle = input.items[i].EventTime;
        output.views[i].tag = {
          timeInterval: {
            start: DateInterval(
              input.items[i].EventTimeAll,
              user.video.beforeInterval
            ),
            end: DateInterval(
              input.items[i].EventTimeAll,
              user.video.afterInterval
            ),
          },
          cameraId: input.items[i].ResourceId,
        };

        // { stationId: string, cameraId: string }
      }
    } else if (isBoolean(input)) {
      output.views[0].title = Language.json.EventType.IllegalDrop;
      output.views[0].titleColor = ColorEnum["red-text"];
      output.views[0].imgDesc1 = "";
      output.views[0].imgDesc1Icon = input
        ? "howell-icon-signal2"
        : "howell-icon-no_signal";
      output.views[0].imgDesc1IconColor = input
        ? ColorEnum["green-text"]
        : ColorEnum["red-text"];
      output.views[0].imgDesc2 = "";
      output.views[0].subTitle = "";
    }
    return output;
  }
}
