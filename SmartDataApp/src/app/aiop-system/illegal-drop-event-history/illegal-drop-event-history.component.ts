import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomTableComponent } from '../../shared-module/custom-table/custom-table.component';
import { EventTableService } from "./business/event-table.service";
@Component({
  selector: 'app-illegal-drop-event-history',
  templateUrl: './illegal-drop-event-history.component.html',
  styleUrls: ['./illegal-drop-event-history.component.styl'],
  providers: [EventTableService]
})
export class IllegalDropEventHistoryComponent implements OnInit {

  @ViewChild('table')
  table: CustomTableComponent;

  startDate = (b: Date) => {
    this.tableService.search.formBeginDate = b;
  }

  endDate = (b: Date) => {
    this.tableService.search.formEndDate = b;
  }
  constructor(private tableService: EventTableService) {
  }

  async ngOnInit() {


    await this.tableService.requestData(1, (page) => {
      this.tableService.eventTable.initPagination(page, async (index) => {
        await this.tableService.requestData(index);
      });
    });
    this.tableService.eventTable.tableSelectIds = this.tableSelectIds;
    this.tableService.divisions = await this.tableService.requestDivisions();
    this.tableService.garbageStations = await this.tableService.requestGarbageStations();
  }
  get tableSelectIds() {
    return this.table.selectedId;
  }

  get selectItems() {
    return this.table.selectedId.length;
  }



  async search() {
    this.tableService.search.state = true;
    await this.tableService.searchData(1, (page) => {
      this.tableService.eventTable.initPagination(page, async (index) => {
        await this.tableService.searchData(index);
      });
    });
  }


}
