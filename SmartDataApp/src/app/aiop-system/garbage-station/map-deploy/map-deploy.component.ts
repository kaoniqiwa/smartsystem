import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DivisionStationTreeComponent } from '../division-station-tree/division-station-tree.component';
import { FlatNode, RightBtn } from '../../../shared-module/custom-tree/custom-tree';
import { DataService as TypeDataService } from '../garbage-station/business/data.service';
import { DataService as CameraDataService } from './business/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Division } from 'src/app/data-core/model/waste-regulation/division';
import { GarbageStation } from 'src/app/data-core/model/waste-regulation/garbage-station';
import { MessageBar } from 'src/app/common/tool/message-bar';


@Component({
  selector: 'app-map-deploy',
  templateUrl: './map-deploy.component.html',
  styleUrls: ['./map-deploy.component.css'],
  providers: [TypeDataService, CameraDataService]
})
export class MapDeployComponent implements OnInit {

  // 行政及垃圾厢房列表
  @ViewChild('stationTree')
  stationTree: DivisionStationTreeComponent;

  // 地图iframe
  @ViewChild('iframe')
  iframe: ElementRef;

  // 提示框
  @ViewChild('confirm')
  confirm: ElementRef;

  confirmMessage: string;
  confirmMode = 0;

  wantUnbindNode: FlatNode;


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

  // 列表右侧按钮
  rightBtn: { iconClass: string, btns: RightBtn[] };

  rightBtnFn = (item: FlatNode) => {
    this.confirmMessage = '是否解除绑定？';
    this.confirm.nativeElement['style'].display = '';
    this.confirmMode = 1;
    this.wantUnbindNode = item;
    // item.id;
  }

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    this.GarbageStation = null;

    this.stationTree.garbageStationTree.getParentNode(item);
    let data: Division[] | GarbageStation[];
    data = this.stationTree.dataService.divisions.filter(x => {
      return x.Id === item.id;
    });
    if (data && data.length > 0) {
      this.DivisionId = data[0].Id;
      this.client.Village.Select(data[0].Id);
      const village = this.dataController.Village.Get(data[0].Id);
      this.client.Viewer.MoveTo(village.center);
      return;
    }

    data = this.stationTree.dataService.garbageStations.filter(x => {
      return x.Id === item.id;
    });
    if (data && data.length > 0) {
      this.DivisionId = data[0].DivisionId;
      this.GarbageStation = data[0];
      this.client.Village.Select(data[0].DivisionId);
      try {
        const point = this.dataController.Village.Point.Get(data[0].DivisionId, data[0].Id);
        this.client.Viewer.MoveTo(point.position);

        this.client.Point.Name.Hide();

        setTimeout(() => {
          this.client.Point.Name.Show(point.id);
        }, 500);



      } catch (error) {
        const village = this.dataController.Village.Get(data[0].DivisionId);
        this.client.Viewer.MoveTo(village.center);
      }
      return;
    }



  }

  constructor(private typeDataService: TypeDataService,
    private cameraDataService: CameraDataService,
    private sanitizer: DomSanitizer,
  ) {
    this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());

  }
  getSrc() {
    const host = document.location.hostname;
    const port = document.location.port;
    return 'http://' + host + ':' + port + '/amap/map_ts.html?v=20200925';
  }

  expandableParentNode(node: FlatNode) {
    node.expandable = true;
    const parent = this.stationTree.garbageStationTree.getParentNode(node);
    if (parent) {
      this.expandableParentNode(parent);
    }
  }

  async ngOnInit() {

    // this.rightBtn = {
    //   iconClass: 'howell-icon-garbage',
    //   btns: [new RightBtn('howell-icon-Unlink', '')]
    // };

    this.client = new CesiumMapClient(this.iframe.nativeElement);
    this.client.Events.OnLoading = () => {
      this.dataController = this.client.DataController;
      const villages = this.dataController.Village.List();

      for (const villageId in villages) {
        if (Object.prototype.hasOwnProperty.call(villages, villageId)) {
          const village = villages[villageId];
          const points = village.points;
          for (const pointId in points) {
            if (Object.prototype.hasOwnProperty.call(points, pointId)) {
              const point = points[pointId];
              this.points[pointId] = point;


              const node = this.stationTree.findNode(point.id);
              node.rightClassBtn = [new RightBtn('howell-icon-Unlink', point.id)];
            }
          }
        }
      }
    };
    this.client.Events.OnLoaded = () => {





      this.client.Point.Draggable(true);





    };
    this.client.Events.OnElementsDoubleClicked = async (objs) => {

    };

    this.client.Events.OnElementsClicked = async (objs) => {
      if (!objs || objs.length <= 0) { return; }

      const element = objs[0];

      const node = this.stationTree.findNode(element.id);
      this.stationTree.selectedItemClick(node);
      this.stationTree.garbageStationTree.getParentNode(node);
      this.expandableParentNode(node);
      // this.stationTree.searchTree(element.name);

    };




    this.client.Events.OnMouseDoubleClick = async (position) => {
      if (this.GarbageStation) {
        if (this.points[this.GarbageStation.Id]) {
          // this.client.Viewer.MoveTo(this.points[this.GarbageStation.Id].position);
          const p = this.points[this.GarbageStation.Id];
          this.client.Events.OnElementDragend(p, position);
          return;
        }
        const point = new CesiumDataController.Point();
        point.id = this.GarbageStation.Id;
        point.name = this.GarbageStation.Name;
        point.parentId = this.DivisionId;
        point.villageId = this.DivisionId;
        point.type = CesiumDataController.ElementType.Camera;
        point.position = position;
        point.position.height = 18;
        try {
          this.dataController.Village.Point.Create(this.GarbageStation.DivisionId, point.id, point);
          new MessageBar().response_success('点位数据创建成功');
        } catch (ex) {
          new MessageBar().response_Error('点位数据创建失败');
        }
        this.points[point.id] = point;
        this.client.Point.Create(point);
        const node = this.stationTree.findNode(point.id);
        node.rightClassBtn = [new RightBtn('howell-icon-Unlink', point.id)];
      }
    };


    this.client.Events.OnElementDragend = async (element, position) => {
      this.confirmMode = 0;
      this.confirmMessage = '是否保存当前位置？';
      this.confirm.nativeElement['style'].display = '';
      this.DragendPoint = element;
      this.DragendPosition = position;

    };
  }




  ConfirmCancel() {
    this.confirm.nativeElement['style'].display = 'none';
    switch (this.confirmMode) {
      case 0:
        if (this.DragendPoint) {
          this.client.Point.Remove(this.DragendPoint.id);
          const point = this.points[this.DragendPoint.id];
          this.client.Point.Create(point);
        }
        break;
      case 1:
        break;
      default:
        break;
    }

  }
  ConfirmSave() {
    this.confirm.nativeElement['style'].display = 'none';
    switch (this.confirmMode) {
      case 0:
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
              (this.DragendPoint as CesiumDataController.Point)
            );
            new MessageBar().response_success('地图数据修改成功');
          } catch (error) {
            new MessageBar().response_Error('地图数据修改失败');
          }

          this.points[this.DragendPoint.id] = this.DragendPoint as CesiumDataController.Point;
          this.client.Point.Remove(this.DragendPoint.id);
          const point = this.points[this.DragendPoint.id];
          this.client.Point.Create(point);
        }
        break;
      case 1:
        if (this.wantUnbindNode) {
          const p = this.points[this.wantUnbindNode.id];
          if (p) {
            try {
              this.dataController.Village.Point.Remove(p.villageId, p.id);
              this.client.Point.Remove(p.id);
              delete this.points[p.id];
              this.wantUnbindNode.rightClassBtn = [];
              new MessageBar().response_success('地图数据删除成功');
            } catch (ex) {
              new MessageBar().response_Error('地图数据删除失败');
            }

          }
        }
        break;
      default:
        break;
    }
  }

}
