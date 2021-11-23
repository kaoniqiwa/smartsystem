import { IViewModel } from "src/app/common/abstract/base-view";
import { IViewEvent } from "src/app/common/interface/IViewEvent";
import { HWSPlayerOptions } from "../../../common/directive/wsplayer-directive";

export class GalleryRollPage implements IViewModel {
  items: Map<number, Gallery>;
  leftBottom: {
    text: number;
  };
  videoOptions: HWSPlayerOptions;

  private _index: number = 1;
  public get index(): number {
    return this._index;
  }
  public set index(v: number) {
    this._index = v;
    if (this.indexChanged) {
      this.indexChanged(this._index);
    }
  }

  indexChanged?: (index: number) => void;

  autoChangePage = true;
}

export class Gallery {
  /** 由于index关联了其他方法，于是用i作为序列 */
  i = 1;
  title: {
    state: string;
    text: string;
    id: string;
    eventNumber: number;
  };
  imgDesc: {
    src: string;
    desc: string;
    tag: any;
    state: boolean;
  }[];
  index = 1;
}

export class GetPictureButtonArgs implements IViewEvent {
  g: Gallery;
  msg: boolean;
  catchState: { o: boolean };
}
