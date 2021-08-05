import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { DataService } from "./business/data.service";
import { GarbageStationList } from "./business/garbage-station-list";
import { StationChartComponent } from "../station-chart/station-chart.component";
import { HouseModeEnum } from "../station-chart/business/station-chart";
import { GarbageStationType } from "../../../data-core/model/waste-regulation/garbage-station-type";
import { MessageBar } from "../../../common/tool/message-bar";
import { ConfirmDialog } from "../../../shared-module/confirm-dialog/confirm-dialog.component";
import { DataTreeNode } from "../../common/tree.service";
import { DateTime } from "src/app/data-core/model/date-time";
@Component({
  selector: "app-garbage-station",
  templateUrl: "./garbage-station.component.html",
  styleUrls: ["./garbage-station.component.styl"],
  providers: [DataService],
})
export class GarbageStationComponent implements OnInit {
  stationList: GarbageStationList;
  trashMode = HouseModeEnum.Trash;

  @ViewChild("stationTree")
  cameraTree: CustomTreeComponent;
  @ViewChild("garbageChart")
  chartComponent: StationChartComponent;

  confirmDialog_: ConfirmDialog;

  searchTree = (text: string) => {
    this.stationList.dataSource.map((x) => (x.show = false));
    const filter = this.stationList.dataSource.filter(
      (x) => x.name.indexOf(text) > -1
    );
    filter.map((x) => (x.show = true));
    if (filter.length) this.treeNodeClick(filter[0]);
    else this.addBtnClick();
  };
  constructor(private dataService: DataService) {
    this.stationList = new GarbageStationList(dataService);
  }

  async ngOnInit() {
    await this.stationList.loadList();
    if (this.dataService.types)
      this.chartComponent.stationChart.changeHouseType =
        this.dataService.types[0];
    // this.stationList.dataSource[0].id
  }

  changeTrashNum(num: string) {
    this.chartComponent.stationChart.changeTrashNum(num);
  }

  treeNodeClick(node: DataTreeNode) {
    const type = this.dataService.types.find((x) => x.Type + "" == node.id);

    this.stationList.selectNode(node);
    this.chartComponent.stationChart.changeTrashNum(type.Windows.length + "");
    this.chartComponent.stationChart.changeHouseType = type;
  }

  delBtnClick() {
    if (this.stationList.selectedNode) {
      this.confirmDialog_ = new ConfirmDialog();
      this.confirmDialog_.cancelFn = () => {
        this.confirmDialog_ = null;
      };
      this.confirmDialog_.content = "确定删除该项";
      this.confirmDialog_.okFn = () => {
        this.stationList.delTreeNode(this.stationList.selectedNode.id);
        this.confirmDialog_ = null;
      };
    }
  }

  addBtnClick() {
    /** 防止反复初始化 */
    if (this.stationList.selectedNode) {
      this.stationList.clearFirsNode();
      this.chartComponent.initChart();
    }
  }

  async saveBtnClick(typeName: string) {
    if (typeName && this.chartComponent.stationChart.checkPositionNo()) {
      const model = new GarbageStationType();
      model.Windows = this.chartComponent.stationChart.stationwindow;
      model.CameraSlots = this.chartComponent.stationChart.cameraSlot;
      model.CreateTime = new Date();
      model.UpdateTime = new Date();
      model.Type = 0;
      model.Name = typeName;
      const result = await this.dataService.addGarbageStationType(model);
      if (!!result) {
        MessageBar.response_success();
        this.dataService.types.push(result);
        this.stationList.addTreeNode(result);
      }
    }
  }
}
