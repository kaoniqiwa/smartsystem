import { IPageTable } from "../interface/IPageTable";
import { FormGroup } from "@angular/forms";

export class TableFormControl<T>   {

    show = false;
    table: IPageTable<T>;
    editItem: T;
    successSaveFn = (success: boolean, item: T, formState: FormStateEnum) => {
        this.show = !success;
        if (formState == FormStateEnum.edit) this.table.editItem(item);
        else if (formState == FormStateEnum.create) this.table.addItem(item);
    }
    cancelFn = () => {
        this.show = false;
        this.editItem = null;
    }
    constructor(table: IPageTable<T>) {
        this.table = table;
    }

}

export class TableAttribute {
    pageSize = 20;
}

export class ListAttribute {
    maxSize = 99999;
    imgUrlRoot = 'assets/img/';
    aiModelIcon='ai-model/'
}

export interface FormAttribute {
    formState: FormStateEnum;
}

export interface TableRequestParam {

}

export class SearchHelper {
    state = false;
    other = false;
   private searchText_ = '';
    searchform: FormGroup;

    set searchText(val: string) {
        this.searchText_ = val.trim();
        this.state = true;
    }
    get searchText() {
        return this.searchText_;
    }

}

export enum TableSearchEnum {
    none,
    search
}

export enum FormStateEnum {
    create,
    edit
}

export enum SystemModeEnum{
    /**监督平台 */
    supervision,
    /**乱扔垃圾事件 */
    illegalDropEvent,
    /**厢房状态 */
    garbageStation,
    /**aiop 后台 */
    aiopSet
  }
  