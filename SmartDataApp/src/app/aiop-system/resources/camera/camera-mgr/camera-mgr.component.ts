import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraTableService } from "./business/camera-table.service";
import { CustomTableComponent } from '../../../../shared-module/custom-table/custom-table.component';
import { PlatformService } from "../../../common/platform-request";
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-camera-mgr',
  templateUrl: './camera-mgr.component.html',
  styleUrls: ['./camera-mgr.component.styl'],
  providers: [CameraTableService,PlatformService]
})
export class CameraMgrComponent implements OnInit {

  @ViewChild('table')
  table: CustomTableComponent;
  
  searchform:FormGroup;
  moreSearchInput = false; 
  constructor(private tableService: CameraTableService,private platformService:PlatformService
  ) {  }
       

  async ngOnInit() {
    await this.tableService.requestEncodeDevices();
    this.tableService.requestCamerasData(1);
    this.tableService.cameraTable.tableSelectIds = this.tableSelectIds;
    this.tableService.cameraTable.attrBtnFn = () => {
      this.showBindLabels();
    }
    await this.tableService.requestResourceLabels();
  }

 async syncBtnClick(){
   await this.platformService.syncPlatform();
   this.tableService.cameraTable.labels.messageBar.response_success('完成同步');
   this.tableService.cameraTable.clearItems();
   this.tableService.dataSource = [];
   //this.table.clearScrollDownCount();
   this.tableService.requestCamerasData(1);
  }

  onLabelsSubmit() {
    this.tableService.cameraTable.labels.bind(this.tableService.cameraTable.labels._dataSource);
  }

  async showBindLabels() {
    if (this.tableSelectIds.length) {
     
      this.tableService.cameraTable.labels.show = true;
      this.tableService.cameraTable.getSelectItemsLabels();
    }
    else this.tableService.cameraTable.labels.messageBar.response_warning('请选择设备');
  }

  hiddenBindLabels() {
    this.tableService.cameraTable.labels.show = false;
    this.tableService.cameraTable.labels.clearDataSource();
  }


  get tableSelectIds() {
    return this.table.selectedId;
  }

  get selectItems() {
    return this.table.selectedId.length;
  }
  async delBtnClick() {
    if(this.tableSelectIds.length)
    this.tableService.cameraTable.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`,async()=>{
      await this.tableService.delCamerasData(this.tableSelectIds);
      for (const id of this.tableSelectIds)
        this.table.deleteListItem(id);
      this.tableService.cameraTable.confirmDialog_=null;
    });
  
    // this.tableService.deviceTable.delItems(this.tableSelectIds);
    // this.tableService.deviceTable.delAllSelectId();
  }

  search() { 
    //this.table.clearScrollDownCount();
    this.tableService.searchCamerasData(1);
  }
}
