import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { CustomTableComponent } from '../../shared-module/custom-table/custom-table.component';
import { EventTableService } from "./business/event-table.service";
import { PageListMode } from "../../common/tool/enum-helper";
import { ImageDesc} from '../image-desc-card/image-desc'
@Component({
  selector: 'hw-illegal-drop-event-history',
  templateUrl: './illegal-drop-event-history.component.html',
  styleUrls: ['./illegal-drop-event-history.component.styl'],
  providers: [EventTableService]
})
export class IllegalDropEventHistoryComponent implements OnInit {
  listTypeView = false;
  listMode = PageListMode.table;
  pageListMode = PageListMode;
  @ViewChild('table')
  table: CustomTableComponent;

  @Input() divisionId:string='';
  @Input() modalDialog=false;

  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  }

  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  }
  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
  }

  listGalleryTargetFn = (val:ImageDesc)=>{
    const event=  this.tableService.eventTable.findEventFn(val.id);
    this.tableService.galleryTargetView.initGalleryTarget(event);
  }

  videoClose = ()=>{
     this.tableService.playVideo=null;
  }
  constructor(private tableService: EventTableService) {
  }

  async ngOnInit() {
    this.tableService.search.divisionId=this.divisionId; 
    await this.tableService.requestData(1, (page) => {
      this.tableService.eventTable.initPagination(page, async (index) => {
        await this.tableService.requestData(index);
      });
      this.tableService.eventCards.initPagination(page);
      this.tableService.eventCards.cardList = this.tableService.eventCards.dataSource;
    });

    // this.tableService.eventTable.tableSelectIds = this.tableSelectIds;
    this.tableService.divisions = await this.tableService.requestDivisions();
    this.tableService.garbageStations = await this.tableService.requestGarbageStations();
    this.tableService.resources = await this.tableService.requestResource();
   
  }

  changeListMode(mode: PageListMode) {
    this.listMode = mode;
    this.listTypeView = false;
  }
 

  async search() {
    this.tableService.search.state = true;
    await this.tableService.searchData(1, (page) => {
      this.tableService.eventTable.initPagination(page, async (index) => {
        await this.tableService.searchData(index);
      });
      this.tableService.eventCards.initPagination(page);
      this.tableService.eventCards.cardList = this.tableService.eventCards.dataSource;
    });
  }


}
