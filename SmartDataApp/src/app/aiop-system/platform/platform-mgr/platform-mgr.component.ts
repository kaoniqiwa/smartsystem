import { Component, OnInit, ViewChild } from '@angular/core';
import { PlatformMgrService } from "./business/platform-mgr.service";
import { CustomTableComponent } from "../../../shared-module/custom-table/custom-table.component";
@Component({
  selector: 'app-platform-mgr',
  templateUrl: './platform-mgr.component.html',
  styleUrls: ['./platform-mgr.component.styl'],
  providers: [PlatformMgrService]
})
export class PlatformMgrComponent implements OnInit {
  @ViewChild('table')
  table: CustomTableComponent;
  constructor(private mgrService: PlatformMgrService) { }
  searchFn = async (text: string) => {
    this.mgrService.search.searchText = text;
    await this.mgrService.searchPlatformData(1, (page) => {
      this.mgrService.table.initPagination(page, async (index) => {
        await this.mgrService.searchPlatformData(index);
      });
    });
  }
  async ngOnInit() {
    await this.mgrService.getPlatformData(1, (page) => {
      this.mgrService.table.initPagination(page, async (index) => {
        await this.mgrService.getPlatformData(index);
      });
    });
    this.mgrService.table.delItemFn = (id: string) => {
      this.mgrService.table.setConfirmDialog(`删除1个选择项`, async () => {
        await this.mgrService.delPlatformsData([id]);
        this.table.deleteListItem(id);
        this.mgrService.table.confirmDialog_ = null;
      });
    }
  }

  async delBtnClick() {
    if (this.tableSelectIds.length)
      this.mgrService.table.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`, async () => {
        await this.mgrService.delPlatformsData(this.tableSelectIds);
        for (const id of this.tableSelectIds)
          this.table.deleteListItem(id);
        this.mgrService.table.confirmDialog_ = null;
      });
  }

  get tableSelectIds() {
    return this.table.selectedId;
  }

  get selectItems() {
    return this.table.selectedId.length;
  }
}
