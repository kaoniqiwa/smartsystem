import { Component, OnInit, ViewChild } from '@angular/core';
import { PageListMode } from '../../common/tool/enum-helper';
import { CustomTableComponent } from '../../shared-module/custom-table/custom-table.component';
import { ImageDesc } from '../../shared-module/image-desc-card/image-desc';
import { EventTableService } from "./business/event-table.service";
@Component({
  selector: 'app-event-history',
  templateUrl: './event-history.component.html',
  styleUrls: ['./event-history.component.styl'],
  providers: [EventTableService]
})
export class EventHistoryComponent implements OnInit {
  listTypeView = false;
  listMode = PageListMode.table;
  pageListMode = PageListMode;

  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  }

  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  }

  galleryTargetFn = () => {
    this.tableService.galleryTargetView.galleryTarget = null;
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
    await this.tableService.getAIModels();
    await this.initTableList();
    await this.tableService.allEventsRecordData();
  }

  async initTableList() {
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

  changeListMode(mode: PageListMode) {
    this.listMode = mode;
    this.listTypeView = false;
    this.tableService.fillMode.pageListMode = mode;
    this.initTableList();
  }


  async search() {
    this.tableService.search.state = true;
    await this.initTableList();
    await this.tableService.allEventsRecordData();
  }

}
