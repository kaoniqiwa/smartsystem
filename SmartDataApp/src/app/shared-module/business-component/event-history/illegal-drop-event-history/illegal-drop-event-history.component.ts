import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTableComponent } from '../../../../shared-module/custom-table/custom-table.component';
import { EventTableService, FillMode } from "./business/event-table.service";
import { PageListMode } from "../../../../common/tool/enum-helper";
import { ImageDesc } from '../../../image-desc-card/image-desc';
import { Router } from '@angular/router'; 
import { SideNavService } from "../../../../common/tool/sidenav.service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { SystemModeEnum } from '../../../../common/tool/table-form-helper';
import {  LevelListPanelComponent } from "../level-list-panel/level-list-panel.component";
import { Camera } from '../../../../data-core/model/waste-regulation/camera';
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
  tableMinusHeight = 'calc(100% - 0px)';
  tableSearchHeight = 'calc(100% - 40px)';
  @ViewChild('table')
  table: CustomTableComponent;
  @ViewChild(LevelListPanelComponent)
  levelListPanel:LevelListPanelComponent;

  @Input() fillMode: FillMode;
  
  /**
   * 用于页面 判断
   */
  @Input() isPage :boolean;
  @Input() changeViewFn:(index:number)=>void;
  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  }

  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  }
  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
  } 

  changeDivisionFn = (divisionId: string) => {
    if(divisionId){
      const garbageStations = this.tableService.garbageStations.filter(x => x.DivisionId == divisionId); 
      this.tableService.search.toStationsDropList = garbageStations;
      const resources = new Array<Camera>()
      garbageStations.map(x => {       
          this.tableService.resources.filter(r => r.GarbageStationId == x.Id).map(c=>{
            resources.push(c);
          });
      });
      this.tableService.search.toResourcesDropList = resources; 
      this.tableService.search.divisionId=divisionId;
      this.tableService.search.stationId='';
    }
    else{
      this.tableService.search.toResourcesDropList = this.tableService.resources;
      this.tableService.search.toStationsDropList = this.tableService.garbageStations;
    }

  }

  listGalleryTargetFn = (val: ImageDesc) => {
    const event = this.tableService.eventTable.findEventFn(val.id);
    this.tableService.galleryTargetView.initGalleryTarget(event);
  }

  videoClose = () => {
    this.tableService.playVideo = null;
  }
 
  constructor(private tableService: EventTableService
   , private navService: SideNavService
    ,private divisionBusinessService:DivisionBusinessService
    , private router: Router) { 
  
  }

  changeStation(val:string){
    this.tableService.search.toResourcesDropList = 
      this.tableService.resources.filter(r => r.GarbageStationId == val);
  }

  async ngOnInit() {  
    this.tableService.search.divisionId = this.fillMode ? this.fillMode.divisionId : '';
    this.listMode = this.fillMode ? this.fillMode.pageListMode : PageListMode.table;
    this.tableService.fillMode = this.fillMode;
    if(this.isPage){ 
      this.tableMinusHeight= 'calc(100% - 20px)';
      this.tableSearchHeight = 'calc(100% - 60px)';
      this.tableService.fillMode=new FillMode(); 
      this.tableService.fillMode.divisionId =   this.divisionBusinessService.divisionsId;      

      if(this.divisionBusinessService.divisionsId){
        this.tableService.search.divisionId=this.divisionBusinessService.divisionsId;
      }
    }


    this.initTableList();
    // this.tableService.eventTable.tableSelectIds = this.tableSelectIds;
    this.tableService.divisions = await this.tableService.requestDivisions();
    this.tableService.garbageStations = await this.tableService.requestGarbageStations();
    this.tableService.resources = await this.tableService.requestResource();
    this.tableService.search.toResourcesDropList = this.tableService.resources;
    this.tableService.search.toStationsDropList = this.tableService.garbageStations;
    this.tableService.divisionListView.toLevelListPanel(this.tableService.divisions);
    await this.tableService.allEventsRecordData();
  }


  moreSearch(){
    this.tableService.search.other=!this.tableService.search.other;
    setTimeout(() => {
      this.levelListPanel.defaultItem(this.divisionBusinessService.divisionsId);
    
    },500);

  }

  goMoreHistroy(){
    this.navService.systemMode = SystemModeEnum.illegalDropEvent;
    this.router.navigateByUrl('aiop/event-history/illegal-drop-event?p=1');
    
  }

  changeView(tagIndex:number){
    this.changeViewFn(tagIndex);
  }

  async initTableList() {
    if (this.tableService.search.state == false) {
      if (this.listMode == PageListMode.table)
        await this.tableService.requestData(1, (page) => {
          this.tableService.eventTable.initPagination(page, async (index) => {
            await this.tableService.requestData(index);
          },!this.isPage);
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.requestDataX(1, (page) => {
          this.tableService.eventCards.initPagination(page, async (index) => {
            await this.tableService.requestDataX(index);
          },!this.isPage);
        });
    }
    else {

      if (this.listMode == PageListMode.table)
        await this.tableService.searchData(1, (page) => {
          this.tableService.eventTable.initPagination(page, async (index) => {
            await this.tableService.searchData(index);
          },!this.isPage);
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.searchDataX(1, (page) => {
          this.tableService.eventCards.initPagination(page, async (index) => {
            await this.tableService.searchDataX(index);
          },!this.isPage);
        });
    }
  }

  changeListMode(mode: PageListMode) {
    this.listMode = mode;
    this.listTypeView = false;
    this.fillMode.pageListMode = mode;
    this.initTableList();
  }


  async search() {
    this.tableService.search.state = true;
    if (this.listMode == PageListMode.table)
      await this.tableService.searchData(1, (page) => {
        this.tableService.eventTable.initPagination(page, async (index) => {
          await this.tableService.searchData(index);
        },!this.isPage);
      });
    else if (this.listMode == PageListMode.list)
      await this.tableService.searchDataX(1, (page) => {
        this.tableService.eventCards.initPagination(page, async (index) => {
          await this.tableService.searchDataX(index);
        },!this.isPage);
      });
    await this.tableService.allEventsRecordData();
  }


}

export enum ContentModeEnum{
  View,
  Page
}
