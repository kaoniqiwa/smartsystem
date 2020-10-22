import { IBusinessData } from "../../../common/interface/IBusiness";
import { DatePipe } from "@angular/common";
import { ImageDesc } from "../../image-desc-card/image-desc";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MediumPicture } from "../../../data-core/url/aiop/resources";
import { ViewPagination } from "../../../shared-module/card-list-panel/card-list-panel";
import { Page } from "../../../data-core/model/page";
import { CardList } from "../illegal-drop-event-card-list/card-list";
export class EventCards {
    dataSource = new Array<ImageDesc>();
    cardList_: CardList;
    pageIndex = 1;
    viewPaginationFn: (page: Page) => ViewPagination;
    constructor(private datePipe: DatePipe) {
        this.cardList_ = new CardList();
    }
    Convert(input: IllegalDropEventRecord[]) {
        for (const item of input) {
            this.dataSource.push(this.toTableModel(item));
        }
    }

    initPagination(page: Page){
        const viewPagination = this.viewPaginationFn(page);        
        this.cardList_.pagination = viewPagination;
        this.cardList_.totalRecordCount = page.TotalRecordCount;
    }

    set cardList(value:ImageDesc[]){
      
        this.cardList_.value = value;
    }

    get cards(){
        return this.cardList_;
    }

    toTableModel(item: IllegalDropEventRecord) {
        return new ImageDesc(item.EventId
            , new MediumPicture().getJPG(item.ImageUrl)
            , [item.ResourceName, item.Data.DivisionName]
            , [this.datePipe.transform(item.EventTime, 'MM-dd HH:mm:ss'), item.Data.StationName]);

    }

    clearData() {
        this.dataSource = new Array();
    }
}
