import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceTableService } from "./business/device-table.service";
import { CustomTableComponent } from '../../../../shared-module/custom-table/custom-table.component';
import { PlatformService } from "../../../common/platform-request";
@Component({
  selector: 'app-encode-device-mgr',
  templateUrl: './encode-device-mgr.component.html',
  styleUrls: ['./encode-device-mgr.component.styl'],
  providers: [DeviceTableService, PlatformService]
})
export class EncodeDeviceMgrComponent implements OnInit {

  @ViewChild('table')
  table: CustomTableComponent;

  constructor(private tableService: DeviceTableService, private platformService: PlatformService
  ) { }

  async ngOnInit() {
    this.tableService.deviceTable.tableSelectIds = this.tableSelectIds;
    this.tableService.deviceTable.attrBtnFn = () => {
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
      this.tableService.deviceTable.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`, async () => {
        await this.tableService.delDevicesData(this.tableSelectIds);
        for (const id of this.tableSelectIds)
          this.table.deleteListItem(id);
        this.tableService.deviceTable.confirmDialog_ = null;
      });
  }

  async search() {
    this.tableService.search.state = true;
    await this.tableService.searchData(1);
  }
}
