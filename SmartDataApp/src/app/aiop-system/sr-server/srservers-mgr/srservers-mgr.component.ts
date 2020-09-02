import { Component, OnInit,ViewChild } from '@angular/core';
import { SRServersService } from "./business/srservers-mgr.service";   
import { CustomTableComponent } from "../../../shared-module/custom-table/custom-table.component";

@Component({
  selector: 'app-srservers-mgr',
  templateUrl: './srservers-mgr.component.html',
  styleUrls: ['./srservers-mgr.component.styl'],
  providers:[SRServersService]
})
export class SRServersMgrComponent implements OnInit {

  @ViewChild('table')
  table: CustomTableComponent;
  searchFn = (text:string)=>{  
     this.mgrService.search.searchText = text;
     this.mgrService.searchSRServerData();
  }
  constructor(private mgrService:SRServersService) { }

 async ngOnInit() {
  await this.mgrService.getSRServerData();
    this.mgrService.table.delItemFn = (id:string)=>{
      this.mgrService.table.setConfirmDialog(`删除1个选择项`,async()=>{
        await this.mgrService.delSRServersData([id]);      
        this.table.deleteListItem(id);
        this.mgrService.table.confirmDialog_=null;
      });
    }
  }

  async delBtnClick() {
    if(this.tableSelectIds.length)
    this.mgrService.table.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`,async()=>{
      await this.mgrService.delSRServersData(this.tableSelectIds);
      for (const id of this.tableSelectIds)
        this.table.deleteListItem(id);
      this.mgrService.table.confirmDialog_=null;
    });
   
  }

  get tableSelectIds() {
    return this.table.selectedId;
  }

  get selectItems() {
    return this.table.selectedId.length;
  }

}
