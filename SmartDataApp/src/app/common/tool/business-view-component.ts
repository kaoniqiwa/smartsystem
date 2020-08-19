import { IBusiness, IBusinessData } from "../interface/IBusiness";
import { IView, IViewModel, ViewsModel } from "../abstract/base-view";
import { IConverter } from "../interface/IConverter"; 
import { Injectable } from "@angular/core";

@Injectable()
export class BusinessViewComponet {
    converter: IConverter;
    business: IBusiness<IBusinessData>;
    view: IView<IViewModel>; 
    constructor(converter: IConverter, business: IBusiness<IBusinessData>, view: IView<IViewModel>) {
        this.converter = converter;
        this.business = business;
        this.view = view;
        this.business.dataChanged = (data: IBusinessData) => {        
           this.businessDataChanged(data);
        }
        this.view.loadDatas =  (datas: IViewModel) =>{
             this.loadDatas(datas); 
        } 
     
    }

    businessDataChanged(data: IBusinessData) {
        let viewModel = this.view.getDatas();
        this.view.setDatas(this.converter.Convert(data,viewModel));
    }

    loadDatas(data: IViewModel=new ViewsModel())
    {
      let businessData = this.business.getData(); 
        this.view.setDatas(this.converter.Convert(businessData, data));
    }


} 