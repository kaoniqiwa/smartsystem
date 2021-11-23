import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  GetPictureButtonArgs,
  Gallery,
  GalleryRollPage,
} from "./gallery-roll-page";
import {
  BasisCardComponent,
  ViewsModel,
} from "../../../common/abstract/base-view";
import { HWVideoService } from "../../../data-core/dao/video-dao";
import { GetPreviewUrlParams } from "../../../data-core/model/aiop/video-url";
import {
  HWSPlayerDirective,
  HWSPlayerOptions,
} from "../../../common/directive/wsplayer-directive";
import {
  moveView2,
  domSize,
} from "../../../common/tool/jquery-help/jquery-help";
import { ArrayPagination } from "../../../common/tool/tool.service";
import { UserDalService } from "../../../dal/user/user-dal.service";
import { SessionUser } from "../../../common/tool/session-user";
import { HWSPlayer } from "../../../common/hws-player";
import {
  GalleryRollPageConfig,
  IGalleryRollPageConfig,
} from "./gallery-roll-page.config";
import { MessageBar } from "src/app/common/tool/message-bar";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { Language } from "src/app/common/tool/language";
@Component({
  selector: "hw-gallery-roll-page",
  templateUrl: "./gallery-roll-page.component.html",
  styleUrls: ["./gallery-roll-page.component.css"],
  providers: [HWVideoService],
})
export class GalleryRollPageComponent
  extends BasisCardComponent
  implements OnInit, OnDestroy
{
  public get model(): GalleryRollPage {
    return this._model as GalleryRollPage;
  }
  @Input()
  public set model(v: GalleryRollPage) {
    this._model = v;
    if (this._model) {
      (this._model as GalleryRollPage).indexChanged = (index) => {
        this.onIndexChanged(index);
      };
    }
  }

  private _config: IGalleryRollPageConfig = new GalleryRollPageConfig();
  public get config(): IGalleryRollPageConfig {
    return this._config;
  }
  @Input()
  public set config(v: IGalleryRollPageConfig) {
    this._config = Object.assign(this._config, v);
  }

  @Output()
  OnNextGroupClicked: EventEmitter<Gallery> = new EventEmitter();
  @Output()
  OnPreviousGroupClicked: EventEmitter<Gallery> = new EventEmitter();

  @Output()
  OnGetPictureClicked: EventEmitter<GetPictureButtonArgs> = new EventEmitter();
  @Output()
  OnSizeChangeClicked: EventEmitter<boolean> = new EventEmitter();

  // @ViewChild(HWSPlayerDirective)
  // player: HWSPlayerDirective;
  player: HWSPlayer;
  playing = false;
  maxWindow = false;
  currentPlayId = "";
  catchState = {
    o: true,
  };
  playViewSize = {
    width: 100,
    height: 100,
  };
  carousel = {
    time: 120,
    interval: -1,
    fn: null,
  };
  galleryHeight = "calc(100% - 46px - 60px)";
  readonly interval_inspection_key = "99";
  user = new SessionUser();
  bigViewId = "";
  @ViewChild("iframe") iframe: ElementRef;
  constructor(
    private sanitizer: DomSanitizer,
    private videoService: HWVideoService,
    private userDalService: UserDalService
  ) {
    super();
  }
  ngOnDestroy() {
    this.maxWindow = false;
    if (this.player) this.player.stopVideo();
  }

  async ngOnInit() {
    this.loadDatas(new ViewsModel());
    this.carousel.fn = () => {
      if (this.model && this.model.autoChangePage) this.nextImgGroup();
    };

    /**实时监控 播放界面 */
    window.setInterval(() => {
      if (this.playing && this.currentPlayId) {
        const val = this.model.items.get(this.model.index),
          clearVideo = () => {
            this.playing = false;
            this.currentPlayId = "";
            if (this.player) this.player.stopVideo();
          };
        if (val && val.imgDesc) {
          const id = val.imgDesc.find((x) => x.tag.id == this.currentPlayId);
          if (id == null) clearVideo();
        } else if (val == null) clearVideo();
      }
    }, 10);
    window.addEventListener("resize", () => {
      this.autoVideoWindowSize();
    });

    var time = await this.userDalService.getUserConfig(
      this.user.id,
      this.interval_inspection_key
    );
    if (time) this.resetCarousel(parseInt(time));
    /**上来就抓图 */
    setTimeout(() => {
      this.tagClick(null, false);
    }, 500);
  }

  async bigView(id?: string) {
    this.bigViewId = this.bigViewId ? "" : id;
    if (this.playing) {
      this.playing = false;
      this.currentPlayId = "";
      if (this.player) this.player.stopVideo();
    }
  }

  autoVideoWindowSize() {
    setTimeout(() => {
      const size = domSize("video__view_wrap");
      if (this.playing && window.screen.width != size.width) {
        const vSize = domSize("item__" + this.currentPlayId);
        console.log(vSize);

        this.playViewSize.width = vSize.width;
        this.playViewSize.height = vSize.height;
        if (this.player)
          this.player.reSizeView(
            this.playViewSize.width,
            this.playViewSize.height
          );
        moveView2("item__" + this.currentPlayId, "video__view_wrap", 0, 0);
      }
    }, 20);
  }

  changeWindow() {
    this.maxWindow = !this.maxWindow;
    //this.galleryHeight = this.maxWindow ? "90%" : "86%";
    this.btnControl(this.maxWindow);
    this.autoVideoWindowSize();
    this.OnSizeChangeClicked.emit(this.maxWindow);
  }

  resetCarousel(time: number, save = false) {
    window.clearInterval(this.carousel.interval);
    this.carousel.time = time;
    this.carousel.interval = window.setInterval(
      this.carousel.fn,
      this.carousel.time * 1000
    );
    if (save)
      this.userDalService.editUserConfig(
        this.user.id,
        this.interval_inspection_key,
        time + ""
      );
  }

  playState(cameraId: string) {
    return this.playing && cameraId == this.currentPlayId;
  }

  fiveTimeVideo() {
    setTimeout(() => {
      if (this.player) this.player.stopVideo();
      this.playing = false;
    }, 300 * 1000); /**播放5 */
  }

  async playVideo(cameraId: string) {
    if (this.config.playVideoToBig && !this.bigViewId) {
      this.bigView(cameraId).then(() => {
        this.playVideo(cameraId);
      });
      return;
    }
    let id = "";
    if (this.config.playVideoToBig) {
      id = "bigger";
    } else {
      id = "item__" + cameraId;
    }
    this.playViewSize = domSize(id);
    console.log(id, this.playViewSize);
    // const videoLive = 4;

    moveView2(id, "video__view_wrap", 0, 0);
    // const config = await this.userDalService.getUserConfig(this.user.id, videoLive + '');
    const params = new GetPreviewUrlParams();
    params.CameraId = cameraId;
    // params.Protocol = 'ws-ps';
    // params.StreamType = config? parseInt(config):1;
    const response = await this.videoService.videoUrl(params);
    // const response = await this.srRequestService.PreviewUrls(params).toPromise();

    setTimeout(() => {
      this.playing = true;
      this.currentPlayId = cameraId;
      // response.Data.Url=response.Data.Url.indexOf('password') >0
      // ? response.Data.Url:response.Data.Url+this.user.videoUserPwd;
      const videoOptions = new HWSPlayerOptions(
        response.WebUrl,
        response.Url,
        ""
      );
      this.player = new HWSPlayer(this.sanitizer);
      this.player.playVideo(videoOptions.webUrl, videoOptions.url);
      setTimeout(() => {
        this.player.iframe = this.iframe;
        this.player.reSizeView(
          this.playViewSize.width,
          this.playViewSize.height
        );
        this.player.stopFn(() => {
          this.playing = false;
          // this.player.playViewSize=this.playViewSize;
          this.btnControl("stop");
          if (this.config.playVideoToBig) {
            this.bigView();
          }
        });
        this.fiveTimeVideo();
        this.btnControl("play");
      }, 500);
    });
  }

  get items() {
    return this.model.items.get(this.model.index);
  }

  private _imgs: Array<any>;
  set imgs(v: Array<any>) {
    this._imgs = v;
  }
  get imgs() {
    const val = this.model.items.get(this.model.index);
    if (val && val.imgDesc) {
      if (val.imgDesc.length > 4) {
        this._imgs = ArrayPagination<any>(1, 9, val.imgDesc);
      } else {
        this._imgs = ArrayPagination<any>(val.index, 4, val.imgDesc);
      }
    } else {
      this._imgs = new Array();
    }
    return this._imgs;
  }

  setviewSize(num: number) {
    if (num > 4) return 33.3;
    else return 50;
  }

  /**9宫格空白填补 */
  fillBlank(n: number) {
    const arr = new Array();
    if (n > 4) for (let i = 0; i < 9 - n; i++) arr.push(1);
    else for (let i = 0; i < 4 - n; i++) arr.push(1);
    return arr;
  }

  get title() {
    const val = this.model.items.get(this.model.index);
    if (val) return val.title.text;
    else return "";
  }

  get titleColor() {
    const val = this.model.items.get(this.model.index);
    var color = "";
    if (val && val.title.state) {
      switch (val.title.state) {
        case "正常":
          color = "green-text";
          break;
        case "满溢":
          color = "orange-text";
          break;
        case "异常":
          color = "red-text";
          break;
        default:
          break;
      }
    }
    return color;
  }

  get stateText() {
    const val = this.model.items.get(this.model.index);
    if (val && val.title.state) return val.title.state;
  }

  get eventNum() {
    const val = this.model.items.get(this.model.index);
    if (val) return val.title.eventNumber;
    else return 0;
  }

  // /**下一组图片 */
  nextImgGroup() {
    try {
      this.bigViewId = "";
      this.model.index += 1;
      if (this.model.index > this.model.items.size) this.model.index = 1;
      this.resetCarousel(this.carousel.time);
      this.tagClick(null, false);
      if (this.player && this.player.playing) {
        this.player.stopVideo();
      }
    } finally {
      this.OnNextGroupClicked.emit(this.model.items.get(this.model.index));
    }
  }

  /**上一组图片 */
  prevImgGroup() {
    try {
      this.bigViewId = "";
      this.model.index -= 1;
      if (this.model.index <= 0) this.model.index = this.model.items.size;
      this.resetCarousel(this.carousel.time);
      this.tagClick(null, false);
      if (this.player && this.player.playing) {
        this.player.stopVideo();
      }
    } finally {
      this.OnPreviousGroupClicked.emit(this.model.items.get(this.model.index));
    }
  }

  /**
   * 图片更新
   * @param param
   * @param msg 是否弹消息
   */
  tagClick(param: string, msg: boolean) {
    if (param) {
      if (this.btnControl) this.btnControl(null);
    } else {
      const val = this.model.items.get(this.model.index);
      if (this.btnControl && this.model) {
        this.catchState.o = false;
        let args = {
          g: val,
          msg: msg,
          catchState: this.catchState,
        };
        this.btnControl(args);
        this.OnGetPictureClicked.emit(args);
      }
    }
  }

  onIndexChanged(index: number) {
    this.bigViewId = "";
    this.resetCarousel(this.carousel.time);
    this.tagClick(null, false);
    if (this.player && this.player.playing) {
      this.player.stopVideo();
    }
  }
}
