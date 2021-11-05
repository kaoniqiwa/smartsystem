/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/10
 */
import { TimeSpan } from "../tool/time-span";
import { IViewEvent } from "../interface/IViewEvent";

export class PagedTimeSpan extends TimeSpan {}

export abstract class BaseView<T extends IViewModel> implements IView<T> {
  abstract get datas(): T;
  abstract set datas(v: T);
  loadDatas(datas: IViewModel): void {}
  timeSpan: PagedTimeSpan;
  viewContrl(isInit: boolean, isNext: boolean): boolean {
    return false;
  }
  btnControl(tag: IViewEvent): void {}

  set defaultViewData(val: T) {}
}

export interface IView<T extends IViewModel> {
  datas: T;
  loadDatas(datas: IViewModel): void;
  timeSpan: PagedTimeSpan;
  viewContrl(isInit: boolean, isNext: boolean): boolean /**翻页 */;
  btnControl(tag: IViewEvent): void;
}

export abstract class CardComponent<T extends ViewsModel<IViewModel>>
  extends BaseView<IViewModel>
  implements ICardView
{
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

  private _datas: T;
  public get datas(): T {
    return this._datas;
  }
  public set datas(v: T) {
    this._datas = v;

    if (this.dataChanged) this.dataChanged();
  }

  abstract dataChanged(): void;
  abstract viewContrl(isInit: boolean, isNext: boolean): boolean;
  btnControl: (tag: IViewEvent) => void;
}

export abstract class InfoCardComponent extends CardComponent<
  ViewsModel<IViewModel>
> {
  model: IViewModel;
  constructor() {
    super();
  }
  dataChanged() {
    if (this.datas && this.datas.views && this.datas.views.length > 0) {
      this.model = this.datas.views[this.datas.pageIndex - 1];
    }
  }
}

export abstract class TableComponent extends CardComponent<
  ViewsModel<IViewModel>
> {}

export class BasisCardComponent extends CardComponent<ViewsModel<IViewModel>> {
  protected _model: IViewModel;
  public get model(): IViewModel {
    return this._model;
  }
  public set model(v: IViewModel) {
    this._model = v;
  }

  show_: boolean = true;
  initEchart: () => void;
  reSizeEchart: () => void;
  set defaultViewData(d: ViewsModel<IViewModel>) {
    this.model = d.views[d.pageIndex - 1];
  }
  constructor() {
    super();
  }
  viewContrl(isInit: boolean, isNext_: boolean) {
    var isNext = false;
    if (isInit) {
      if (this.datas) {
        if (this.datas.pageIndex >= this.datas.pageSize) {
          this.show_ = true;
          this.datas.pageIndex = 1;
          isNext = true;
        } else {
          this.datas.pageIndex += 1;
          isNext = this.datas.pageIndex > this.datas.pageSize;
        }
        this.model = this.datas.views[this.datas.pageIndex - 1];
        // if (this.initEchart) this.initEchart();
      }
    } else
      setTimeout(() => {
        this.show_ = false;
      });

    if (isInit == false && isNext_) {
      this.show_ = false;

      setTimeout(() => {
        this.datas.pageIndex = 1;
        this.model = this.datas.views[this.datas.pageIndex - 1];
        // if (this.reSizeEchart) this.reSizeEchart();
      });
    }
    return isNext;
  }
  dataChanged() {
    if (this.datas && this.datas.views && this.datas.views.length > 0)
      this.model = this.datas.views[this.datas.pageIndex - 1];
    if (this.initEchart) this.initEchart();
  }
}

export class EChartCardComponent extends BasisCardComponent {}

export abstract class VideoCardComponent extends CardComponent<
  ViewsModel<IViewModel>
> {
  model: IViewModel;
  playVideo: () => void;
  constructor() {
    super();
  }
  dataChanged() {
    if (this.datas && this.datas.views && this.datas.views.length > 0)
      this.model = this.datas.views[this.datas.pageIndex - 1];
    if (this.playVideo) {
      this.playVideo();
    }
  }
}

export interface ICardView {
  dataChanged(): void;
}
export interface IViewSize {
  viewSize: {
    width: string | number;
    height: string | number;
  };
}
export class PackingBoxComponent
  extends BaseView<IViewModel>
  implements IViewSize
{
  private _datas: IViewModel;
  public get datas(): IViewModel {
    return this._datas;
  }
  public set datas(v: IViewModel) {
    this._datas = v;
  }

  viewSize: { width: string | number; height: string | number };
  selected = false;
  click: () => void;
}
export interface IViewModel {}

export class ViewsModel<T extends IViewModel>
  implements IViewModel, IViewPage<T>
{
  pageIndex: number = 1;
  pageSize: number = 1;
  views: T[];
}

export interface IViewPage<T extends IViewModel> {
  pageIndex: number;
  pageSize: number;
  views: T[];
}
