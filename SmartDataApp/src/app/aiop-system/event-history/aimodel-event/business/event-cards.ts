import { DatePipe } from "@angular/common";
import { ImageDesc } from "../../../../shared-module/image-desc-card/image-desc";
import { ViewPagination } from "../../../../shared-module/card-list-panel/card-list-panel";
import { Page } from "../../../../data-core/model/page";
import { CardList } from "../../../../shared-module/business-component/event-history/illegal-drop-event-card-list/card-list";
import { CameraAIEventRecord } from "../../../../data-core/model/aiop/camera-ai-event-record";
import { Language } from "../../../../common/tool/language";
import { ResourceMediumRequestService } from "../../../../data-core/repuest/resources.service";
export class EventCards {
  dataSource = new Array<ImageDesc>();
  cardList_: CardList;
  pageIndex = 1;
  constructor(private datePipe: DatePipe) {
    this.cardList_ = new CardList();
  }
  Convert(input: CameraAIEventRecord[]) {
    for (const item of input) {
      this.dataSource.push(this.toTableModel(item));
    }
  }

  initPagination(
    page: Page,
    requestData: (index: number, ...any) => void,
    toEnd?: boolean
  ) {
    this.cardList_.totalRecordCount = page.TotalRecordCount;
    this.cardList_.pagination = new ViewPagination(
      page.PageCount,
      (index) => {
        if (this.pageIndex != index) {
          requestData(index);
          this.pageIndex = index;
        }
      },
      toEnd
    );
  }

  set cardList(value: ImageDesc[]) {
    this.cardList_.value = value;
  }

  get cards() {
    return this.cardList_;
  }

  toTableModel(item: CameraAIEventRecord) {
    return new ImageDesc(
      item.EventId,
      ResourceMediumRequestService.getJPG(item.ImageUrl),
      [item.ResourceName, Language.EventType(item.EventType)],
      [
        this.datePipe.transform(item.EventTime, "MM-dd HH:mm:ss"),
        Language.ResourceType(item.ResourceType),
      ],
      item.ResourceName +
        " " +
        this.datePipe.transform(item.EventTime, "yyyy-MM-dd HH:mm:ss") +
        "".replace("-", "_") +
        ".jpeg"
    );
  }

  clearData() {
    this.dataSource = new Array();
  }
}
