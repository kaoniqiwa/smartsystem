import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import {
  FlatNode,
  RightBtn,
  RightButton,
  RightButtonArgs,
  TreeNode,
} from "../../../shared-module/custom-tree/custom-tree";
import { DataService as TypeDataService } from "../garbage-station/business/data.service";
import { MapDeployCoordinateWindowService } from "./business/map-deploy-coordinate-window-data.service";
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
  DivisionId: string;

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
    let village = this.dataController.Village.Get(node.id);
    let points = village.points;
    for (const pointId in points) {
      if (Object.prototype.hasOwnProperty.call(points, pointId)) {
        let point = this.getPoint(pointId);
        let item = node.children.find((x) => x.id === pointId);
        if (item) {
          // item.rightClassBtn = [
          //   new RightButton("howell-icon-Unlink", RightButtonTag.Unlink),
          // ];
        }
      }
    }
  }

  onTreeNodeRightLinkClicked(args: RightButtonArgs<GarbageStation>) {
    this.wantBindNode = args.node;

    this.mapCoordinateWubdiwDataService.Display = true;
    this.mapCoordinateWubdiwDataService.Title = args.node.name;

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
  }
  onTreeNodeRightUnlinkClicked(args: RightButtonArgs<GarbageStation>) {
    this.unbindDisplay = true;
    this.wantUnbindNode = args.node;
    this.pointSelected = this.getPoint(args.node.id);
  }

  rightButtonClick(args: RightButtonArgs<GarbageStation>) {
    console.log(args);
    if (args.node.data.GisPoint) {
      this.onTreeNodeRightUnlinkClicked(args);
    } else {
      this.onTreeNodeRightLinkClicked(args);
    }
  }
  onTreeNodeLoaded(nodes: TreeNode<GarbageStation | Division>[]) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.data instanceof GarbageStation) {
        let unlink = new RightButton<GarbageStation>(
          "howell-icon-Unlink",
          RightButtonTag.Unlink
        );
        unlink.data = node.data;

        unlink.display = !!node.data.GisPoint;

        let link = new RightButton<GarbageStation>(
          "howell-icon-Link",
          RightButtonTag.Link
        );
        link.data = node.data;
        link.display = !node.data.GisPoint;
        node.rightClassBtn = [link, unlink];
      }
      if (node.children) {
        this.onTreeNodeLoaded(node.children);
      }
    }
  }

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    this.GarbageStation = null;

    // this.stationTree.garbageStationTree.getParentNode(item);
    let data: Division | GarbageStation;
    // 如果选中的是区域项
    data = this.stationTree.dataService.divisions.find((x) => {
      return x.Id === item.id;
    });

    if (data) {
      this.DivisionId = data.Id;
      this.client.Village.Select(data.Id);
      const village = this.dataController.Village.Get(data.Id);
      try {
        if (this.gisPointChanging) {
          data.GisArea = new GisArea();
          data.GisArea.GisType = GisType.GCJ02;
          data.GisArea.GisPoint = village.areas.map((x) => {
            return new GisPoint(x, GisType.GCJ02);
          });
          data.GisPoint = new GisPoint(
            [village.center.lon, village.center.lat],
            GisType.GCJ02
          );

          let response = await this.divisionService.set(data);
          console.log(response);
          new MessageBar().response_success("录入区划坐标成功");
        }
      } catch (error) {
        new MessageBar().response_Error("录入区划坐标失败");
      }

      this.client.Viewer.MoveTo(village.center);
      this.wantUnbindNode = undefined;
      this.pointSelected = undefined;
      return;
    }
    // 如果选中的是垃圾厢房
    data = this.stationTree.dataService.garbageStations.find((x) => {
      return x.Id === item.id;
    });
    if (data) {
      this.DivisionId = data.DivisionId;
      this.GarbageStation = data;
      this.client.Village.Select(data.DivisionId);

      this.wantUnbindNode = item;
      if (!this.points[item.id]) {
        this.pointSelected = undefined;
      }

      try {
        const point = this.dataController.Village.Point.Get(
          data.DivisionId,
          data.Id
        );
        if (point) {
          // item.rightClassBtn = [
          //   new RightButton("howell-icon-Unlink", RightButtonTag.Unlink),
          // ];
          try {
            if (this.gisPointChanging) {
              data.GisPoint = new GisPoint(
                [point.position.lon, point.position.lat],
                GisType.GCJ02
              );
              let response = await this.garbageService.set(data);
              console.log(response);
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

    // node.rightClassBtn = [
    //   new RightBtn("howell-icon-Unlink", RightButtonTag.Unlink),
    // ];
    this.wantUnbindNode = undefined;

    let data = this.stationTree.dataService.garbageStations.find((x) => {
      return x.Id === point.id;
    });
    if (data) {
      data.GisPoint = new GisPoint(
        [point.position.lon, point.position.lat],
        GisType.GCJ02
      );
      let promise = this.garbageService.set(data);
      promise
        .then((res) => {
          new MessageBar().response_success("点位坐标录入成功");
        })
        .catch((ex) => {
          new MessageBar().response_Error("点位坐标录入失败");
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
      this.dataController = this.client.DataController;
      this.mapCoordinateWubdiwDataService.client = this.client;
      this.mapCoordinateWubdiwDataService.dataController =
        this.client.DataController;
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
          new MessageBar().response_success("点位数据创建成功");
        } catch (ex) {
          new MessageBar().response_Error("点位数据创建失败");
        }
        this.points[point.id] = point;
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
        const point = this.getPoint(this.DragendPoint.id);
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
    }

    try {
      if (this.pointSelected) {
        result = this.RemovePoint(this.pointSelected);
        return;
      }
      if (this.wantUnbindNode) {
        this.pointSelected = this.getPoint(this.wantUnbindNode.id);
        result = this.RemovePoint(this.pointSelected);
        if (result) {
          for (let i = 0; i < this.wantUnbindNode.rightClassBtn.length; i++) {
            this.wantUnbindNode.rightClassBtn[i].display =
              !this.wantUnbindNode.rightClassBtn[i].display;
          }
        }
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
