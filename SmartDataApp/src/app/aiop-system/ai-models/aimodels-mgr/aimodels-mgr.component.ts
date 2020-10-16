import { Component, OnInit, ViewChild } from '@angular/core';
import { AIModelsMgrService } from "./business/ai-model-mgr.service";
import { CustomTableComponent } from "../../../shared-module/custom-table/custom-table.component";
@Component({
  selector: 'app-aimodels-mgr',
  templateUrl: './aimodels-mgr.component.html',
  styleUrls: ['./aimodels-mgr.component.styl'],
  providers: [AIModelsMgrService]
})
export class AIModelsMgrComponent implements OnInit {

  @ViewChild('table')
  table: CustomTableComponent;
  constructor(private mgrService: AIModelsMgrService) { }
  searchFn =async (text:string)=>{  
    this.mgrService.search.searchText = text; 
    await this.mgrService.searchAIModelData(1, (page) => {
      this.mgrService.table.initPagination(page, async (index) => {
        await this.mgrService.searchAIModelData(index);
      });
    });
 }
  async ngOnInit() { 
    await this.mgrService.getAIIcons(); 
    await this.mgrService.getAIModelData(1, (page) => {
      this.mgrService.table.initPagination(page, async (index) => {
        await this.mgrService.getAIModelData(index);
      });
    });
    this.mgrService.table.delItemFn = (id: string) => {
      this.mgrService.table.setConfirmDialog(`删除1个选择项`, async () => {
        await this.mgrService.delAIModelsData([id]);
        this.table.deleteListItem(id);
        this.mgrService.table.confirmDialog_ = null;
      });
    }
  }

  async delBtnClick() {
    if (this.tableSelectIds.length)
      this.mgrService.table.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`, async () => {
        await this.mgrService.delAIModelsData(this.tableSelectIds);
        const ids = Array.from(this.tableSelectIds);
        for (const id of ids)
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
