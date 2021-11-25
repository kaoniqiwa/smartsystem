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
  title: GalleryTitle;
  imgDesc: GalleryImage[];
  index = 1;
}

export class GalleryTitle {
  state: string;
  text: string;
  id: string;
  eventNumber: number;
}

export class GalleryImage {
  src: string;
  desc: string;
  tag: GalleryImageTag;
  state: boolean;
}
export class GalleryImageTag {
  id: string;
}

export class GetPictureButtonArgs implements IViewEvent {
  g: Gallery;
  msg: boolean;
  catchState: { o: boolean };
}

export class PlaybackGallery {
  cameraId: string;
  begin: Date;
  end: Date;
  playing: boolean = false;
}
