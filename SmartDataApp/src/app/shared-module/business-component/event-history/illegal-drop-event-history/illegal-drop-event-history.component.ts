import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTableComponent } from '../../../../shared-module/custom-table/custom-table.component';
import { EventTableService, FillMode } from "./business/event-table.service";
import { PageListMode } from "../../../../common/tool/enum-helper";
import { ImageDesc } from '../../../image-desc-card/image-desc';
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

  @Input() fillMode: FillMode;

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
      garbageStations.map(x => {
        this.tableService.search.toResourcesDropList =
          this.tableService.resources.filter(r => r.GarbageStationId == x.Id);
      })
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
  constructor(private tableService: EventTableService) {
  }

  async ngOnInit() {
    this.listMode = this.fillMode ? this.fillMode.pageListMode : PageListMode.table;
    this.tableService.fillMode = this.fillMode;
    this.tableService.search.divisionId = this.fillMode ? this.fillMode.divisionId : '';
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

  async initTableList() {
    if (this.tableService.search.state == false) {
      if (this.listMode == PageListMode.table)
        await this.tableService.requestData(1, (page) => {
          this.tableService.eventTable.initPagination(page, async (index) => {
            await this.tableService.requestData(index);
          });
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.requestDataX(1, (page) => {
          this.tableService.eventCards.initPagination(page, async (index) => {
            await this.tableService.requestDataX(index);
          });
        });
    }
    else {

      if (this.listMode == PageListMode.table)
        await this.tableService.searchData(1, (page) => {
          this.tableService.eventTable.initPagination(page, async (index) => {
            await this.tableService.searchData(index);
          });
        });
      else if (this.listMode == PageListMode.list)
        await this.tableService.searchDataX(1, (page) => {
          this.tableService.eventCards.initPagination(page, async (index) => {
            await this.tableService.searchDataX(index);
          });
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
        });
      });
    else if (this.listMode == PageListMode.list)
      await this.tableService.searchDataX(1, (page) => {
        this.tableService.eventCards.initPagination(page, async (index) => {
          await this.tableService.searchDataX(index);
        });
      });
    await this.tableService.allEventsRecordData();
  }


}
