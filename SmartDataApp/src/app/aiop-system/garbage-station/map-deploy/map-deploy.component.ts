import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import {
  FlatNode,
  RightBtn,
} from "../../../shared-module/custom-tree/custom-tree";
import { DataService as TypeDataService } from "../garbage-station/business/data.service";
import { MapDeployCoordinateWindowService } from "./business/map-deploy-coordinate-window-data.service";
import { DomSanitizer } from "@angular/platform-browser";
import {
  Division,
  GisArea,
  GisPoint,
  GisType,
} from "../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { MessageBar } from "../../../common/tool/message-bar";
import { ConfirmDialog } from "../../../shared-module/confirm-dialog/confirm-dialog.component";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";

@Component({
  selector: "app-map-deploy",
  templateUrl: "./map-deploy.component.html",
  styleUrls: ["./map-deploy.component.css"],
  providers: [TypeDataService, MapDeployCoordinateWindowService],
})
export class MapDeployComponent implements OnInit {
  // 行政及垃圾厢房列表
  @ViewChild("stationTree")
  stationTree: DivisionStationTreeComponent;

  // 地图iframe
  @ViewChild("iframe")
  iframe: ElementRef;

  // // 提示框
  // @ViewChild('locationConfirm')
  // locationConfirm: ConfirmComponent;

  // @ViewChild('unbindConfirm')
  // unbindConfirm: ConfirmComponent;

  locationDialog = new ConfirmDialog({
    title: "提示",
    content: "是否保存当前位置？",
    okFn: () => {
      this.locationYesClicked();
    },
    cancelFn: () => {
      this.locationCancelClicked();
    },
  });
  locationDisplay = false;

  unbindDialog = new ConfirmDialog({
    title: "提示",
    content: "是否解除绑定？",
    okFn: () => {
      this.unbindYesClicked();
    },
    cancelFn: () => {
      this.unbindCancelClicked();
    },
  });
  unbindDisplay = false;

  wantUnbindNode: FlatNode;
  wantBindNode: FlatNode;

  // 是否可拖拽
  draggable = false;

  gisPointChanging = false;

  mouseLon = 0;
  mouseLat = 0;

  // 地图地址
  srcUrl: any;

  // 列表所选中的垃圾厢房
  GarbageStation: GarbageStation;

  // 列表所选中的行政区ID
  DivisionId: string;

  // 地图客户端
  client: CesiumMapClient;

  // 地图数据控制器
  dataController: CesiumDataController.Controller;

  // 地图拖动点位
  DragendPoint?: CesiumDataController.Element;
  // 地图点位拖动位置
  DragendPosition?: CesiumDataController.Position;
  // 地图所有点位
  points: Global.Dictionary<CesiumDataController.Point> = {};

  pointSelected: CesiumDataController.Point;

  // 列表右侧按钮
  rightBtn: { iconClass: string; btns: RightBtn[] };

  rightBtnFn = (item: FlatNode) => {
    console.log(item);

    if (!item.rightClassBtn || item.rightClassBtn.length === 0) {
      return;
    }

    console.log(item);
    debugger;

    switch (item.rightClassBtn[0].tag) {
      case RightButtonTag.Link:
        this.wantBindNode = item;

        this.mapCoordinateWubdiwDataService.Display = true;
        this.mapCoordinateWubdiwDataService.Title = item.name;

        if (this.wantBindNode) {
          const point = new CesiumDataController.Point();
          point.id = this.wantBindNode.id;
          point.name = this.wantBindNode.name;
          point.parentId = this.DivisionId;
          point.villageId = this.DivisionId;
          point.type = CesiumDataController.ElementType.Camera;
          point.position.height = 18;
          this.mapCoordinateWubdiwDataService.standbyPoint = point;
        }

        break;
      case RightButtonTag.Unlink:
        // this.unbindConfirm.display = true;
        this.unbindDisplay = true;
        this.wantUnbindNode = item;
        this.pointSelected = this.points[item.id];

        break;
      case RightButtonTag.position:
        break;
      default:
        break;
    }

    // item.id;
  };

  checkPoints(village: CesiumDataController.Village, nodes: FlatNode[]) {
    const points = village.points;
    for (const pointId in points) {
      if (Object.prototype.hasOwnProperty.call(points, pointId)) {
        const point = points[pointId];

        this.points[pointId] = point;
        const node = nodes.find((x) => x.id == pointId);
        node.rightClassBtn = [
          new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
        ];
      }
    }
  }
  // checkPoints(nodes: FlatNode[]) {
  //   for (let i = 0; i < nodes.length; i++) {
  //     const node = nodes[i];
  //     node.rightClassBtn = [
  //       new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
  //     ];
  //   }
  // }

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    this.GarbageStation = null;

    // this.stationTree.garbageStationTree.getParentNode(item);
    let data: Division[] | GarbageStation[];
    // 如果选中的是区域项
    data = this.stationTree.dataService.divisions.filter((x) => {
      return x.Id === item.id;
    });

    if (data && data.length > 0) {
      this.DivisionId = data[0].Id;
      this.client.Village.Select(data[0].Id);
      const village = this.dataController.Village.Get(data[0].Id);
      try {
        if (this.gisPointChanging) {
          data[0].GisArea = new GisArea();
          data[0].GisArea.GisType = GisType.GCJ02;
          data[0].GisArea.GisPoint = village.areas.map((x) => {
            return new GisPoint(x, GisType.GCJ02);
          });
          data[0].GisPoint = new GisPoint(
            [village.center.lon, village.center.lat],
            GisType.GCJ02
          );

          let response = await this.divisionService.set(data[0]).toPromise();
          console.log(response);
          if (response.FaultCode === undefined || response.FaultCode != 0) {
            throw new Error(response.FaultReason);
          }
          new MessageBar().response_success("录入区划坐标成功");
        }
      } catch (error) {
        new MessageBar().response_Error("录入区划坐标失败");
      }

      this.client.Viewer.MoveTo(village.center);
      this.wantUnbindNode = undefined;
      this.pointSelected = undefined;
      if (item.children) {
        this.checkPoints(village, item.children);
      }
      return;
    }
    // 如果选中的是垃圾厢房
    data = this.stationTree.dataService.garbageStations.filter((x) => {
      return x.Id === item.id;
    });
    if (data && data.length > 0) {
      this.DivisionId = data[0].DivisionId;
      this.GarbageStation = data[0];
      this.client.Village.Select(data[0].DivisionId);

      this.wantUnbindNode = item;
      if (!this.points[item.id]) {
        this.pointSelected = undefined;
      }

      try {
        const point = this.dataController.Village.Point.Get(
          data[0].DivisionId,
          data[0].Id
        );
        if (point) {
          item.rightClassBtn = [
            new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
          ];
          try {
            if (this.gisPointChanging) {
              data[0].GisPoint = new GisPoint(
                [point.position.lon, point.position.lat],
                GisType.GCJ02
              );
              let response = await this.garbageService.set(data[0]).toPromise();
              console.log(response);
              if (response.FaultCode === undefined || response.FaultCode != 0) {
                throw new Error(response.FaultReason);
              }
              new MessageBar().response_success("录入点位坐标成功");
            }
          } catch (error) {
            new MessageBar().response_Error("录入点位坐标失败");
          }

          this.pointSelected = point;
          this.client.Viewer.MoveTo(point.position);

          this.client.Point.Name.Hide();

          setTimeout(() => {
            this.client.Point.Name.Show(point.id);
          }, 500);
        }
      } catch (error) {
        // const village = this.dataController.Village.Get(data[0].DivisionId);
        // this.client.Viewer.MoveTo(village.center);
      }
      return;
    }
  };

  constructor(
    private typeDataService: TypeDataService,
    private mapCoordinateWubdiwDataService: MapDeployCoordinateWindowService,
    private sanitizer: DomSanitizer,
    private divisionService: DivisionRequestService,
    private garbageService: GarbageStationRequestService
  ) {
    this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());
    mapCoordinateWubdiwDataService.OnPointCreated = (
      point: CesiumDataController.Point
    ) => {
      this.onPointCreated(point);
    };
  }

  onPointCreated(point: CesiumDataController.Point) {
    this.points[point.id] = point;
    this.client.Point.Create(point);
    this.pointSelected = point;
    const node = this.stationTree.findNode(point.id);
    node.rightClassBtn = [
      new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
    ];
    this.wantUnbindNode = undefined;
  }

  getSrc() {
    const host = document.location.hostname;
    const port = document.location.port;
    return "http://" + host + ":" + port + "/amap/map_ts.html?v=20200925";
  }

  expandableParentNode(node: FlatNode) {
    node.expandable = true;
    const parent = this.stationTree.garbageStationTree.getParentNode(node);
    if (parent) {
      this.expandableParentNode(parent);
    }
  }

  async ngOnInit() {
    this.rightBtn = {
      iconClass: "howell-icon-garbage",
      btns: [new RightBtn("howell-icon-Link", RightButtonTag.Link)],
    };

    this.client = new CesiumMapClient(this.iframe.nativeElement);
    this.client.Events.OnLoading = () => {
      this.dataController = this.client.DataController;
      this.mapCoordinateWubdiwDataService.client = this.client;
      this.mapCoordinateWubdiwDataService.dataController =
        this.client.DataController;
      // const villages = this.dataController.Village.List();

      // for (const villageId in villages) {
      //   if (Object.prototype.hasOwnProperty.call(villages, villageId)) {
      //     const village = villages[villageId];
      //     const points = village.points;
      //     for (const pointId in points) {
      //       if (Object.prototype.hasOwnProperty.call(points, pointId)) {
      //         const point = points[pointId];
      //         this.points[pointId] = point;

      //         const node = this.stationTree.findNode(point.id);
      //         node.rightClassBtn = [new RightBtn('howell-icon-Unlink', RightButtonTag.Unlink)];
      //       }
      //     }
      //   }
      // }
    };
    this.client.Events.OnLoaded = () => {};
    this.client.Events.OnElementsDoubleClicked = async (objs) => {};

    this.client.Events.OnElementsClicked = async (objs) => {
      if (!objs || objs.length <= 0) {
        return;
      }

      const element = objs[0];
      this.pointSelected = element as unknown as CesiumDataController.Point;
      const node = this.stationTree.findNode(element.id);
      this.stationTree.selectedItemClick(node);
      // this.stationTree.garbageStationTree.getParentNode(node);
      // this.expandableParentNode(node);
      // this.stationTree.searchTree(element.name);
    };

    this.client.Events.OnMouseMoving = async (lon: number, lat: number) => {
      this.mouseLon = lon;
      this.mouseLat = lat;
    };

    this.client.Events.OnMouseDoubleClick = async (position) => {
      if (this.wantBindNode) {
        if (this.points[this.wantBindNode.id]) {
          // this.client.Viewer.MoveTo(this.points[this.GarbageStation.Id].position);
          const p = this.points[this.wantBindNode.id];
          this.client.Events.OnElementDragend(p, position);
          return;
        }
        const point = new CesiumDataController.Point();
        point.id = this.wantBindNode.id;
        point.name = this.wantBindNode.name;
        point.parentId = this.DivisionId;
        point.villageId = this.DivisionId;
        point.type = CesiumDataController.ElementType.Camera;
        point.position = position;
        point.position.height = 18;
        try {
          const parentNode = this.stationTree.garbageStationTree.getParentNode(
            this.wantBindNode
          );
          this.dataController.Village.Point.Create(
            parentNode.id,
            point.id,
            point
          );
          new MessageBar().response_success("点位数据创建成功");
        } catch (ex) {
          new MessageBar().response_Error("点位数据创建失败");
        }
        this.points[point.id] = point;
        this.client.Point.Create(point);
        this.pointSelected = point;
        const node = this.stationTree.findNode(point.id);
        this.wantUnbindNode = undefined;
        node.rightClassBtn = [
          new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
        ];
      }
    };

    this.client.Events.OnElementDragend = async (element, position) => {
      // this.locationConfirm.display = true;
      this.locationDisplay = true;
      this.DragendPoint = element;
      this.DragendPosition = position;
    };
  }
  locationYesClicked() {
    try {
      if (this.DragendPoint && this.DragendPosition) {
        const position = new CesiumDataController.Position(
          this.DragendPosition.lon,
          this.DragendPosition.lat,
          this.DragendPoint.position.height
        );
        this.DragendPoint.position = position;
        try {
          this.dataController.Village.Point.Update(
            this.DragendPoint.parentId,
            this.DragendPoint.id,
            this.DragendPoint as CesiumDataController.Point
          );
          new MessageBar().response_success("地图数据修改成功");
        } catch (error) {
          new MessageBar().response_Error("地图数据修改失败");
        }

        this.points[this.DragendPoint.id] = this
          .DragendPoint as CesiumDataController.Point;
        this.client.Point.Remove(this.DragendPoint.id);
        const point = this.points[this.DragendPoint.id];
        this.client.Point.Create(point);
      }
    } finally {
      this.locationDisplay = false;
    }
  }
  locationCancelClicked() {
    try {
      if (this.DragendPoint) {
        this.client.Point.Remove(this.DragendPoint.id);
        const point = this.points[this.DragendPoint.id];
        this.client.Point.Create(point);
      }
    } finally {
      this.locationDisplay = false;
    }
  }
  unbindYesClicked() {
    let result = false;

    try {
      if (this.pointSelected) {
        result = this.RemovePoint(this.pointSelected);
        return;
      }
      if (this.wantUnbindNode) {
        this.pointSelected = this.points[this.wantUnbindNode.id];
        result = this.RemovePoint(this.pointSelected);
      }
    } finally {
      if (result) {
        this.pointSelected = undefined;
      }
      this.unbindDisplay = false;
    }
  }
  unbindCancelClicked() {
    this.unbindDisplay = false;
  }

  DraggableClicked() {
    this.draggable = !this.draggable;
    this.client.Point.Draggable(this.draggable);
    if (this.draggable) {
      new MessageBar().response_success("点位拖拽已开启");
    } else {
      new MessageBar().response_warning("点位拖拽已关闭");
    }
  }

  RemovePointClicked() {
    if (this.pointSelected) {
      this.unbindDisplay = true;
      // this.RemovePoint(this.pointSelected);
      // this.pointSelected = undefined;
    }
  }

  RemovePoint(point: CesiumDataController.Point) {
    try {
      if (!this.wantUnbindNode) {
        this.wantUnbindNode = this.stationTree.findNode(this.pointSelected.id);
      }
      this.dataController.Village.Point.Remove(point.villageId, point.id);
      this.client.Point.Remove(point.id);
      delete this.points[point.id];
      this.wantUnbindNode.rightClassBtn = [
        new RightBtn("howell-icon-Link", RightButtonTag.Link),
      ];
      new MessageBar().response_success("地图数据删除成功");
      return true;
    } catch (ex) {
      new MessageBar().response_Error("地图数据删除失败");
      return false;
    }
  }

  GisPointClicked() {
    this.gisPointChanging = !this.gisPointChanging;
    if (this.gisPointChanging) {
      new MessageBar().response_success("录入点位坐标已开启");
    } else {
      new MessageBar().response_warning("录入点位坐标已关闭");
    }
  }
}

enum RightButtonTag {
  Unlink = "0",
  Link = "1",
  position = "2",
}
