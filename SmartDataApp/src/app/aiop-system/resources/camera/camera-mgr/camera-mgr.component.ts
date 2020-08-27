import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraTableService } from "./business/camera-table.service";
import { CustomTableComponent } from '../../../../shared-module/custom-table/custom-table.component';
import { PlatformService } from "../../../common/platform-request";
import { CustomTreeComponent } from "../../../../shared-module/custom-tree/custom-tree.component";
import { FormGroup } from '@angular/forms';
import { RegionTreeService } from "../../../common/region-tree.service";
import { InputTagArea } from '../../../../shared-module/input-tag-area/input-tag-area';

@Component({
  selector: 'app-camera-mgr',
  templateUrl: './camera-mgr.component.html',
  styleUrls: ['./camera-mgr.component.styl'],
  providers: [CameraTableService, RegionTreeService]
})
export class CameraMgrComponent implements OnInit {
  @ViewChild('tree')
  tree: CustomTreeComponent;
  @ViewChild('table')
  table: CustomTableComponent;

  searchTree = (text: string) => {
    const dataSource = this.regionTreeService.filterNodes(text);
    this.tree.clearNestedNode();
    this.tree.dataSource.data = dataSource;
    this.tree.defaultItem();
    this.tree.treeControl.expandAll();
  }


  moreSearchInput = false;
  constructor(private tableService: CameraTableService, private regionTreeService: RegionTreeService
  ) { }


  async ngOnInit() {
    await this.regionTreeService.getRegionData();
    const dataSource = this.regionTreeService.loadTree(this.regionTreeService.dataSource);
    this.tree.dataSource.data = dataSource;
    this.tableService.regionTree.treeNodeSource = dataSource;
    this.tree.defaultItem();
    await this.tableService.requestEncodeDevices();

    this.tableService.cameraTable.tableSelectIds = this.tableSelectIds;
    this.tableService.cameraTable.attrBtnFn = () => {
      this.showBindLabels();
    }
    await this.tableService.requestResourceLabels((items) => {
      
        this.tableService.search.toInputTagSelect(items);
    });
  }

  onLabelsSubmit() {
    this.tableService.bindLabelsFn(this.tableService._tagSource);
  }

  async showBindLabels() {
    if (this.tableSelectIds.length) {
      this.tableService.viewShow = true;
      this.tableService.getSelectItemsLabels(this.tableSelectIds);
    }
    else this.tableService.messageBar.response_warning('请选择设备');
  }

  hiddenBindLabels() {
    this.tableService.viewShow = false;
    this.tableService.clearDataSource();
  }


  get tableSelectIds() {
    return this.table.selectedId;
  }

  get selectItems() {
    return this.table.selectedId.length;
  }
  async delBtnClick() {
    if (this.tableSelectIds.length)
      this.tableService.cameraTable.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`, async () => {
        await this.tableService.delCamerasData(this.tableSelectIds);
        for (const id of this.tableSelectIds)
          this.table.deleteListItem(id);
        this.tableService.cameraTable.confirmDialog_ = null;
      });
  }

  async search() {
    this.tableService.search.state = true;  
    await this.tableService.searchCamerasData(1);
  }
}
