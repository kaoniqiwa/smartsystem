import { CustomTableArgs, FootArgs } from "../../shared-module/custom-table/custom-table-model";
import { ITableField } from "./ITableField";
import { ConfirmDialog } from "../../shared-module/confirm-dialog/confirm-dialog.component";
import { MessageBar } from "../../common/tool/message-bar";
import { Page } from "../../data-core/model/page";
import { ViewPagination } from "../../shared-module/card-list-panel/card-list-panel";
export class BusinessTable {
    dataSource: CustomTableArgs<ITableField>;
    confirmDialog_: ConfirmDialog;
    tableSelectIds: string[];
    msg = new MessageBar();
    pageIndex = 1;
    set totalCount(val: number) {
        this.dataSource.footArgs.totalRecordCount = val;
    }

    set pageCount(val: number) {
        this.dataSource.footArgs.pageCount = val;
    }

    initPagination(page: Page, requestData: (index: number, ...any) => void) {
        this.dataSource.paginationOptions = new ViewPagination(page.PageCount, (index) => {

            if (this.pageIndex != index) {
                requestData(index);
                this.pageIndex = index;
            }
        });
    }

    setConfirmDialog(msg: string, okFn: () => void) {
        this.confirmDialog_ = new ConfirmDialog();
        this.confirmDialog_.cancelFn = () => {
            this.confirmDialog_ = null;
        }
        this.confirmDialog_.content = msg;
        this.confirmDialog_.okFn = () => {
            okFn();
        }
    }

    clearItems() {
        this.dataSource.values = [];
        this.dataSource.iconTextTagAttr = [];
        this.dataSource.footArgs.totalRecordCount = 0;
        this.dataSource.footArgs.pageCount = 1;
    }

    delItems(ids: string[]) {
        for (const id of ids) {
            const index = this.dataSource.values.findIndex(x => x.id == id);
            if (index > -1)
                this.dataSource.values.splice(index, 1);
        }
        this.dataSource.footArgs.totalRecordCount -= ids.length;
    }
}