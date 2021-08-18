import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DivisionTreeComponent } from "../division-tree/division-tree.component";
import {
  FlatNode,
  RightBtn,
  RightButton,
  RightButtonArgs,
  TreeNode,
} from "../../../shared-module/custom-tree/custom-tree";
import { DataService as TypeDataService } from "../garbage-station/business/data.service";
import { MapDeployCoordinateWindowBusiness } from "./business/map-deploy-coordinate-window-data.business";
import { DomSanitizer } from "@angular/platform-browser";
import {
  Division,
  GisArea,
  GisPoint,
} from "../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { MessageBar } from "../../../common/tool/message-bar";
import { ConfirmDialog } from "../../../shared-module/confirm-dialog/confirm-dialog.component";
import { DivisionRequestService } from "../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../data-core/repuest/garbage-station.service";
import { GisType } from "../../../data-core/model/enum";

@Component({
  selector: "app-map-deploy",
  templateUrl: "./map-deploy.component.html",
  styleUrls: ["./map-deploy.component.css"],
  providers: [TypeDataService, MapDeployCoordinateWindowBusiness],
})
export class MapDeployComponent implements OnInit {
  // 行政及垃圾厢房列表
  @ViewChild("stationTree")
  stationTree: DivisionTreeComponent;

  // 地图iframe
  @ViewChild("iframe")
  iframe: ElementRef;

  // // 提示框
  // @ViewChild('locationConfirm')
  // locationConfirm: ConfirmComponent;

  // @ViewChild('unbindConfirm')
  // unbindConfirm: ConfirmComponent;

  GarbageStationRightButtons = (data: Division | GarbageStation) => {
    if (data instanceof Division) return undefined;
    let link = new RightButton(
      "howell-icon-Link",
      RightButtonTag.Link,
      (data: GarbageStation) => {
        if (!data) return false;
        return !data.GisPoint;
      },
      data
    );

    let unlink = new RightButton(
      "howell-icon-Unlink",
      RightButtonTag.Unlink,
      (data: GarbageStation) => {
        if (!data) return false;
        return !!data.GisPoint;
      },
      data
    );
    return [link, unlink];
  };

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

  wantUnbindNode: FlatNode<GarbageStation>;
  wantBindNode: FlatNode<GarbageStation>;

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
  DivisionSelectedId: string;
  DivisionExpandId: string;

  get DivisionId() {
    return this.DivisionSelectedId || this.DivisionExpandId;
  }

  // 地图客户端
  client: CesiumMapClient;

  // 地图数据控制器
  dataController?: CesiumDataController.Controller;

  // 地图拖动点位
  DragendPoint?: CesiumDataController.Element;
  // 地图点位拖动位置
  DragendPosition?: CesiumDataController.Position;
  // 地图所有点位
  points: Global.Dictionary<CesiumDataController.Point> = {};

  getPoint(pointId: string, villageId?: string) {
    if (this.points[pointId]) {
      return this.points[pointId];
    }
    try {
      if (villageId) {
        this.points[pointId] = this.dataController.Village.Point.Get(
          villageId,
          pointId
        );
      }
    } catch (error) {}
  }

  pointSelected: CesiumDataController.Point;

  onItemExpandClicked(node: FlatNode) {
    this.DivisionExpandId = node.id;
    this.DivisionSelectedId = undefined;
    let village = this.dataController.Village.Get(node.id);
    let points = village.points;
    for (const pointId in points) {
      if (Object.prototype.hasOwnProperty.call(points, pointId)) {
        let point = this.getPoint(pointId);
        let item = node.children.find((x) => x.id === pointId);
      }
    }
  }

  onTreeNodeRightLinkClicked(args: RightButtonArgs<GarbageStation>) {
    this.wantBindNode = args.node;

    this.mapCoordinateWubdiwDataBusiness.Display = true;
    this.mapCoordinateWubdiwDataBusiness.Title = args.node.name;

    if (this.wantBindNode) {
      const point = new CesiumDataController.Point();
      point.id = this.wantBindNode.id;
      point.name = this.wantBindNode.name;
      point.parentId = this.DivisionId;
      point.villageId = this.DivisionId;
      point.type = CesiumDataController.ElementType.Camera;
      point.position.height = 18;
      this.mapCoordinateWubdiwDataBusiness.standbyPoint = point;
    }
  }
  onTreeNodeRightUnlinkClicked(args: RightButtonArgs<GarbageStation>) {
    this.unbindDisplay = true;
    this.wantUnbindNode = args.node;
    this.pointSelected = this.getPoint(args.node.id);
  }

  rightButtonClick(args: RightButtonArgs<GarbageStation>) {
    switch (args.btn.tag) {
      case RightButtonTag.Link:
        this.onTreeNodeRightLinkClicked(args);
        break;
      case RightButtonTag.Unlink:
        this.onTreeNodeRightUnlinkClicked(args);
        break;

      default:
        break;
    }
    console.log(args);
  }
  onTreeNodeLoaded(nodes: TreeNode<GarbageStation | Division>[]) {
    // for (let i = 0; i < nodes.length; i++) {
    //   const node = nodes[i];
    //   if (node.data instanceof GarbageStation) {
    //
    //     if (node.rightClassBtn) {
    //       for (let i = 0; i < node.rightClassBtn.length; i++) {
    //         switch (node.rightClassBtn[i].tag) {
    //           case RightButtonTag.Unlink:
    //
    //             node.rightClassBtn[i].display = !!node.data.GisPoint;
    //             break;
    //           case RightButtonTag.Link:
    //
    //             node.rightClassBtn[i].display = !node.data.GisPoint;
    //             break;
    //           default:
    //             break;
    //         }
    //       }
    //     }
    //   }
    //   if (node.children) {
    //     this.onTreeNodeLoaded(node.children);
    //   }
    // }
  }

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    this.GarbageStation = null;

    if (item.data instanceof Division) {
      this.DivisionSelectedId = item.data.Id;
      this.DivisionExpandId = undefined;

      this.client.Village.Select(item.data.Id);
      const village = this.dataController.Village.Get(item.data.Id);
      try {
        if (this.gisPointChanging) {
          // item.data.GisArea = new GisArea();
          // item.data.GisArea.GisType = GisType.GCJ02;
          // item.data.GisArea.GisPoint = village.areas.map((x) => {
          //   return new GisPoint(x, GisType.GCJ02);
          // });
          item.data.GisPoint = new GisPoint(
            [village.center.lon, village.center.lat],
            GisType.GCJ02
          );

          let response = await this.divisionService.set(item.data);
          console.log(response);
          MessageBar.response_success("录入区划坐标成功");
        }
      } catch (error) {
        MessageBar.response_Error("录入区划坐标失败");
      }

      this.client.Viewer.MoveTo(village.center);
      this.wantUnbindNode = undefined;
      this.pointSelected = undefined;
    } else {
      this.DivisionSelectedId = item.data.DivisionId;
      this.DivisionExpandId = undefined;
      this.GarbageStation = item.data;
      this.client.Village.Select(item.data.DivisionId);

      this.wantUnbindNode = item;
      if (!this.points[item.id]) {
        this.pointSelected = undefined;
      }

      try {
        const point = this.dataController.Village.Point.Get(
          item.data.DivisionId,
          item.data.Id
        );
        if (point) {
          // item.rightClassBtn = [
          //   new RightButton("howell-icon-Unlink", RightButtonTag.Unlink),
          // ];
          try {
            if (this.gisPointChanging) {
              item.data.GisPoint = new GisPoint(
                [point.position.lon, point.position.lat],
                GisType.GCJ02
              );
              let response = await this.garbageService.set(item.data);
              console.log(response);
              MessageBar.response_success("录入点位坐标成功");
            }
          } catch (error) {
            MessageBar.response_Error("录入点位坐标失败");
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
    }
  };

  constructor(
    private typeDataService: TypeDataService,
    private mapCoordinateWubdiwDataBusiness: MapDeployCoordinateWindowBusiness,
    private sanitizer: DomSanitizer,
    private divisionService: DivisionRequestService,
    private garbageService: GarbageStationRequestService
  ) {
    this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());
    mapCoordinateWubdiwDataBusiness.OnPointCreated = (
      point: CesiumDataController.Point
    ) => {
      this.onPointCreated(point);
    };
  }

  onPointCreated(point: CesiumDataController.Point) {
    if (!this.wantBindNode) return;

    if (this.DivisionId) {
      this.client.Point.Create(point);

      this.points[point.id] = point;
      this.pointSelected = point;
    }

    let data = this.wantBindNode.data;
    // let data = this.stationTree.dataService.garbageStations.find((x) => {
    //   return x.Id === point.id;
    // });
    if (data) {
      data.GisPoint = new GisPoint(
        [point.position.lon, point.position.lat],
        GisType.GCJ02
      );
      let promise = this.garbageService.set(data);
      promise
        .then((res) => {
          if (this.wantBindNode.rightClassBtn) {
            for (let i = 0; i < this.wantBindNode.rightClassBtn.length; i++) {
              this.wantBindNode.rightClassBtn[i].display =
                !this.wantBindNode.rightClassBtn[i].display;
            }
          }
          MessageBar.response_success("点位坐标录入成功");
        })
        .catch((ex) => {
          MessageBar.response_Error("点位坐标录入失败");
        });
    }
  }

  getSrc() {
    const host = document.location.hostname;
    const port = document.location.port;
    return "http://" + host + ":" + port + "/amap/map_ts.html?v=20200925";
  }

  expandableParentNode(node: FlatNode<Division | GarbageStation>) {
    node.expandable = true;
    const parent = this.stationTree.garbageStationTree.getParentNode(node);
    if (parent) {
      this.expandableParentNode(parent);
    }
  }

  async ngOnInit() {
    // this.rightBtn = {
    //   iconClass: "howell-icon-garbage",
    //   btns: [new RightBtn("howell-icon-Link", RightButtonTag.Link)],
    // };

    this.client = new CesiumMapClient(this.iframe.nativeElement);
    this.client.Events.OnLoading = () => {
      this.dataController = this.client.DataController;
      this.mapCoordinateWubdiwDataBusiness.client = this.client;
      this.mapCoordinateWubdiwDataBusiness.dataController =
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
    this.client.Events.OnLoaded = () => {
      MessageBar.response_success("地图初始化完成");
    };
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
          MessageBar.response_success("点位数据创建成功");
        } catch (ex) {
          MessageBar.response_Error("点位数据创建失败");
        }
        this.points[point.id] = point;
        console.log("this.client.Point.Create", "OnMouseDoubleClick");
        this.client.Point.Create(point);
        this.pointSelected = point;
        const node = this.stationTree.findNode(point.id);
        this.wantUnbindNode = undefined;

        // node.rightClassBtn = [
        //   new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
        // ];
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
          MessageBar.response_success("地图数据修改成功");
        } catch (error) {
          MessageBar.response_Error("地图数据修改失败");
        }

        this.points[this.DragendPoint.id] = this
          .DragendPoint as CesiumDataController.Point;
        this.client.Point.Remove(this.DragendPoint.id);
        const point = this.points[this.DragendPoint.id];
        console.log("this.client.Point.Create", "locationYesClicked");
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
        const point = this.getPoint(this.DragendPoint.id);
        console.log("this.client.Point.Create", "locationCancelClicked");
        this.client.Point.Create(point);
      }
    } finally {
      this.locationDisplay = false;
    }
  }
  unbindYesClicked() {
    let result = false;

    if (this.wantUnbindNode) {
      let station = this.wantUnbindNode.data;
      station.GisPoint = undefined;
      this.garbageService.set(station);
      result = true;
      for (let i = 0; i < this.wantUnbindNode.rightClassBtn.length; i++) {
        this.wantUnbindNode.rightClassBtn[i].display =
          !this.wantUnbindNode.rightClassBtn[i].display;
      }
    }

    try {
      this.client.Point.Remove(this.wantUnbindNode.data.Id);
      this.dataController.Village.Point.Remove(
        this.wantUnbindNode.data.DivisionId,
        this.wantUnbindNode.data.Id
      );

      this.pointSelected = undefined;
      this.unbindDisplay = false;

      MessageBar.response_success("地图数据删除成功");
    } catch (ex) {
      MessageBar.response_Error("地图数据删除失败");
    } finally {
    }
  }
  unbindCancelClicked() {
    this.unbindDisplay = false;
  }

  DraggableClicked() {
    this.draggable = !this.draggable;
    this.client.Point.Draggable(this.draggable);
    if (this.draggable) {
      MessageBar.response_success("点位拖拽已开启");
    } else {
      MessageBar.response_warning("点位拖拽已关闭");
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
      this.client.Point.Remove(point.id);
      this.dataController.Village.Point.Remove(point.villageId, point.id);

      delete this.points[point.id];
      MessageBar.response_success("地图数据删除成功");
      return true;
    } catch (ex) {
      MessageBar.response_Error("地图数据删除失败");
      return false;
    }
  }

  GisPointClicked() {
    this.gisPointChanging = !this.gisPointChanging;
    if (this.gisPointChanging) {
      MessageBar.response_success("录入点位坐标已开启");
    } else {
      MessageBar.response_warning("录入点位坐标已关闭");
    }
  }
}

enum RightButtonTag {
  Unlink = "0",
  Link = "1",
  position = "2",
}
