import { PageListMode } from "src/app/common/tool/enum-helper";

export class TableFillMode {
  constructor(sessionTag: string, tableSize: number, cardSize: number) {
    this.sessionTag = sessionTag;
    this.tablePageSize = tableSize;
    this.cardPageSize = cardSize;
  }
  divisionId: string = "";
  tablePageSize: number = 9;
  cardPageSize: number = 15;
  pageListMode_: PageListMode;
  sessionTag = "";
  get pageListMode() {
    const val = sessionStorage.getItem(this.sessionTag);
    return val ? val : PageListMode.table;
  }

  set pageListMode(val: any) {
    sessionStorage.setItem(this.sessionTag, val.toString());
  }
}
