import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceTableService } from "./business/device-table.service";
import { CustomTableComponent } from '../../../../shared-module/custom-table/custom-table.component';
import { PlatformService } from "../../../common/platform-request";
@Component({
  selector: 'app-encode-device-mgr',
  templateUrl: './encode-device-mgr.component.html',
  styleUrls: ['./encode-device-mgr.component.styl'],
  providers: [DeviceTableService,PlatformService]
})
export class EncodeDeviceMgrComponent implements OnInit {

  @ViewChild('table')
  table: CustomTableComponent;
  searchFn = (text: string) => {
    this.search(text);
  }
  constructor(private tableService: DeviceTableService,private platformService:PlatformService
  ) { }

  ngOnInit() {

    this.tableService.requestData(1);
    this.tableService.deviceTable.tableSelectIds = this.tableSelectIds;
    this.tableService.deviceTable.attrBtnFn = () => {
      this.showBindLabels();
    }
  }
  async syncBtnClick(){
    await this.platformService.syncPlatform();
    this.tableService.deviceTable.labels.messageBar.response_success('完成同步');
    this.tableService.deviceTable.clearItems();
    this.tableService.dataSource = [];
    //this.table.clearScrollDownCount();
    this.tableService.requestData(1);
   }
   
  onLabelsSubmit() {
    this.tableService.deviceTable.labels.bind(this.tableService.deviceTable.labels._dataSource);
  }

  async showBindLabels() {
    if (this.tableSelectIds.length) {
      await this.tableService.requestResourceLabels();
      this.tableService.deviceTable.labels.show = true;
      this.tableService.deviceTable.getSelectItemsLabels();
    }
    else this.tableService.deviceTable.labels.messageBar.response_warning('请选择设备');
  }

  hiddenBindLabels() {
    this.tableService.deviceTable.labels.show = false;
    this.tableService.deviceTable.labels.clearDataSource();
  }

  get tableSelectIds() {
    return this.table.selectedId;
  }

  get selectItems() {
    return this.table.selectedId.length;
  }
  async delBtnClick() {
    if (this.tableSelectIds.length)
      this.tableService.deviceTable.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`, async () => {
        await this.tableService.delDevicesData(this.tableSelectIds);
        for (const id of this.tableSelectIds)
          this.table.deleteListItem(id);
        this.tableService.deviceTable.confirmDialog_ = null;
      });

    // this.tableService.deviceTable.delItems(this.tableSelectIds);
    // this.tableService.deviceTable.delAllSelectId();
  }

  search(text: string) {
    this.tableService.search.text = text;
    //this.table.clearScrollDownCount();
    this.tableService.searchData(1);
  }
}
