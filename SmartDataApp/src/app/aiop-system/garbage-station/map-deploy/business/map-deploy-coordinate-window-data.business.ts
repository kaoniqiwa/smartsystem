import { Injectable } from "@angular/core";
import { CameraRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { ICoordinate } from "../coordinate-manage/coordinate-manage.component";
import { MessageBar } from "../../../../common/tool/message-bar";
import { CoordinateTransform } from "./CoordinateTransform";
@Injectable()
export class MapDeployCoordinateWindowBusiness {
  Title: string;
  Display: boolean = false;

  standbyPoint?: CesiumDataController.Point;

  // 地图客户端
  client: CesiumMapClient;

  // 地图数据控制器
  dataController: CesiumDataController.Controller;

  YesEvent(params: ICoordinate) {
    let lon = parseFloat(params.lon);
    let lat = parseFloat(params.lat);
    let gcj02 = CoordinateTransform.bd09togcj02(lon, lat);

    if (this.standbyPoint) {
      this.standbyPoint.position = new CesiumDataController.Position(
        gcj02[0],
        gcj02[1],
        18
      );
      try {
        this.dataController.Village.Point.Create(
          this.standbyPoint.villageId,
          this.standbyPoint.id,
          this.standbyPoint
        );

        MessageBar.response_success("点位数据创建成功");
        if (this.OnPointCreated) {
          this.OnPointCreated(this.standbyPoint);
        }
      } catch (ex) {
        MessageBar.response_Error("点位数据创建失败");
      }
    }

    this.Display = false;
  }
  NoEvent() {
    this.standbyPoint = undefined;
    this.Display = false;
  }

  OnPointCreated?: (point: CesiumDataController.Point) => void;

  constructor() {}
}
