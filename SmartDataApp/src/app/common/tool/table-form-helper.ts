import { IPageTable } from "../interface/IPageTable";

export class TableFormControl<T>   {
   
    show = false;
    table:IPageTable<T>;
    editItem:T;
    successSaveFn = (success:boolean,item:T,formState:FormStateEnum)=>{
        this.show=!success;  
        if(formState == FormStateEnum.edit)this.table.editItem(item);
        else if(formState == FormStateEnum.create)this.table.addItem(item);
    }
    cancelFn = ()=>{
        this.show=false;
        this.editItem=null;
    }
    constructor(table:IPageTable<T>){
        this.table = table;
    }

}

export class TableAttribute{
    pageSize = 20;
}

export class ListAttribute{
    maxSize = 99999;
    imgUrlRoot = 'assets/img/';
}

export interface FormAttribute{
    formState:FormStateEnum;
}

export interface TableRequestParam{

}

export class SearchHelper{
     state = false;
   private text_ = '';
    set text(_:string){
         this.text_ = _.trim() =='' ? '':_;
         this.state = true;

    }
    get text(){
        return this.text_;
    } 
}

export enum TableSearchEnum{
    none,
    search
}

export enum FormStateEnum{
    create,
    edit
}