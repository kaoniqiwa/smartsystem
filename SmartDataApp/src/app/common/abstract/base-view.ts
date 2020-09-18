/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/10
 */
import { TimeSpan } from "../tool/time-span";
import { IViewEvent } from "../interface/IViewEvent";

 

export class PagedTimeSpan extends TimeSpan{

}

export class BaseView<T extends IViewModel> implements IView<T> {
  datas: T;
  getDatas(): T {
    return this.datas;
  }
  setDatas(datas: T) {
    this.datas = datas;

  }
  set defaultViewData(val:T){
     
  }
  timeSpan: PagedTimeSpan;
  loadDatas: (datas: IViewModel) => void;
  viewContrl: (isInit: boolean, isNext: boolean) => boolean;
  btnControl: (tag: IViewEvent) => void;
}

export interface IView<T extends IViewModel> {
  datas: T;
  getDatas(): T;
  setDatas(datas: T): void;
  loadDatas: (datas: IViewModel) => void;
  timeSpan: PagedTimeSpan;
  viewContrl: (isInit: boolean, isNext: boolean) => boolean;/**翻页 */
  btnControl: (tag: IViewEvent) => void;
}

export class CardComponent<T extends ViewsModel<IViewModel>> extends BaseView<IViewModel> implements ICardView {
  viewsModel: T;
  // show_=true;
  timeSpan: PagedTimeSpan;
  constructor() {
    super();
    this.timeSpan = new PagedTimeSpan();
    this.timeSpan.nextRefreshTime = new Date();
    this.timeSpan.timeElasped = () => {
      this.viewContrl(false, false);
    };
  }
  setDatas(datas: T) {
    this.viewsModel = datas;
    if (this.dataChanged) this.dataChanged();
  }
  getDatas() {
    return this.viewsModel;
  }
  dataChanged: () => void;
  viewContrl: (isInit: boolean, isNext: boolean) => boolean;
  btnControl: (tag: IViewEvent) => void;

}
export class InfoCardComponent extends CardComponent<ViewsModel<IViewModel>>{
  model: IViewModel;
  constructor() {
    super();
    this.dataChanged = () => {
      let d = this.getDatas();
      this.model = d.views[d.pageIndex - 1];
    }
  }
}

export class TableComponent extends CardComponent<ViewsModel<IViewModel>>{

}


export class BasisCardComponent extends CardComponent<ViewsModel<IViewModel>>{
  model: IViewModel;
  show_: boolean = true;
  initEchart: () => void;
  reSizeEchart: () => void;
  set defaultViewData(d:ViewsModel<IViewModel>){debugger
    this.model = d.views[d.pageIndex - 1];
      }
  constructor() {
    super();
    this.viewContrl = (isInit: boolean, isNext_: boolean) => {
      var isNext = false;
      if (isInit) {
        let d = this.getDatas();
        if (d) {
          if (d.pageIndex >= d.pageSize) {
            this.show_ = true;
            d.pageIndex = 1;
            isNext = true;
          }
          else {
            d.pageIndex += 1;
            isNext = d.pageIndex > d.pageSize;
          }
          this.model = d.views[d.pageIndex - 1];
          if (this.reSizeEchart) this.reSizeEchart();
        }
      }
      else
        setTimeout(() => {
          this.show_ = false;
        });


      if (isInit == false && isNext_) {
        this.show_ = false;

        setTimeout(() => {
          let d = this.getDatas();
          d.pageIndex = 1;
          this.model = d.views[d.pageIndex - 1];
          if (this.reSizeEchart) this.reSizeEchart();
        });
      };
      return isNext;
    }
    this.dataChanged = () => {
      let d = this.getDatas();
      this.model = d.views[d.pageIndex - 1];
      if (this.initEchart) this.initEchart();
    }
  }
}

export class EChartCardComponent extends BasisCardComponent { }


export class VideoCardComponent extends CardComponent<ViewsModel<IViewModel>> {
  model: IViewModel;
  playVideo: () => void;
  constructor() {
    super();

    this.dataChanged = () => {

      const d = this.getDatas();
      this.model = d.views[d.pageIndex - 1];
      if (this.playVideo) { this.playVideo(); }
    }
  }
}


export interface ICardView {
  dataChanged: () => void;
}
export interface IViewSize {
  viewSize: {
    width: string | number,
    height: string | number
  }
}
export class PackingBoxComponent extends BaseView<IViewModel> implements IViewSize {
  viewSize: { width: string | number; height: string | number; };
  selected = false;
  click: () => void;
}
export interface IViewModel {

}

export class ViewsModel<T extends IViewModel> implements IViewModel, IViewPage<T>{
  pageIndex: number = 1;
  pageSize: number = 1;
  views: T[];
}

export interface IViewPage<T extends IViewModel> {
  pageIndex: number;
  pageSize: number;
  views: T[];
}