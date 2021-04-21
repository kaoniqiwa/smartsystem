import { Component, Input, OnInit, ViewChild, OnDestroy, ElementRef, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryRollPage } from "./gallery-roll-page";
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import { HWVideoService } from "../../../data-core/dao/video-dao"; 
import { GetPreviewUrlParams } from "../../../data-core/model/aiop/video-url";
import { HWSPlayerDirective, HWSPlayerOptions } from "../../../common/directive/wsplayer-directive";
import { moveView2, domSize } from "../../../common/tool/jquery-help/jquery-help";
import { ArrayPagination } from "../../../common/tool/tool.service";
import { UserDalService } from '../../../dal/user/user-dal.service';
import { SessionUser } from "../../../common/tool/session-user";
import {  WHSPlayer } from '../../../common/hws-player';
@Component({
  selector: 'hw-gallery-roll-page',
  templateUrl: './gallery-roll-page.component.html',
  styleUrls: ['./gallery-roll-page.component.styl'],
  providers:[HWVideoService]
})
export class GalleryRollPageComponent extends BasisCardComponent implements OnInit, OnDestroy {

  @Input() model: GalleryRollPage;

  // @ViewChild(HWSPlayerDirective)
  // player: HWSPlayerDirective;
  p:WHSPlayer;
  playing = false;
  maxWindow = false;
  currentPlayId = '';
  catchState = {
    o: true
  };
  playViewSize = {
    width: 100,
    height: 100
  }
  carousel = {
    time: 120,
    interval: -1,
    fn: null
  }
  galleryHeight = '86%';
  readonly interval_inspection_key = '99';
  user = new SessionUser();
  bigViewId = '';
  @ViewChild('iframe') iframe: ElementRef;
  constructor(
    private sanitizer: DomSanitizer,
    private videoService:HWVideoService, 
    private userDalService: UserDalService
  ) {
    super();
  }
  ngOnDestroy() {
    this.maxWindow = false;
    this.p.stopVideo();
  }

  async ngOnInit() {
    this.loadDatas(new ViewsModel());
    this.carousel.fn = () => {
      if (this.model && this.model.autoChangePage)
        this.nextImgGroup();
    }

    
   

    /**实时监控 播放界面 */
    window.setInterval(() => {
      if (this.playing && this.currentPlayId) {
        const val = this.model.items.get(this.model.index), clearVideo = () => {
          this.playing = false;
          this.currentPlayId = '';
          this.p.stopVideo();
        };
        if (val && val.imgDesc) {
          const id = val.imgDesc.find(x => x.tag.id == this.currentPlayId);
          if (id == null) clearVideo();
        }
        else if (val == null) clearVideo();
      }
    }, 10);
    window.addEventListener("resize", () => {
      this.autoVideoWindowSize(); 
    });

    var time = await this.userDalService.getUserConfig(this.user.id, this.interval_inspection_key);
    if (time) this.resetCarousel(parseInt(time));
    /**上来就抓图 */
    setTimeout(() => {
      this.tagClick(null, false);
    }, 500);
  }

  bigView(id: string) {
    this.bigViewId = this.bigViewId ? '' : id;
    if (this.playing) {
      this.playing = false;
      this.currentPlayId = '';
      this.p.stopVideo();
    }
  }

  autoVideoWindowSize() {
    setTimeout(() => {      
      const size = domSize('video__view_wrap');
      if (this.playing && window.screen.width != size.width) {
        const vSize = domSize('item__' + this.currentPlayId); console.log(vSize);

      this.playViewSize.width = vSize.width;
      this.playViewSize.height = vSize.height;
        this.p.reSizeView(this.playViewSize.width, this.playViewSize.height);
        moveView2('item__' + this.currentPlayId, 'video__view_wrap', 0, 0);
      }
    }, 20);
  }

  changeWindow() {
    
    this.maxWindow = !this.maxWindow;
    this.galleryHeight = this.maxWindow ? '90%' : '86%';
    this.btnControl(this.maxWindow);
    this.autoVideoWindowSize();
  }


  resetCarousel(time: number, save = false) {
    window.clearInterval(this.carousel.interval);
    this.carousel.time = time;
    this.carousel.interval = window.setInterval(this.carousel.fn, this.carousel.time * 1000);
    if (save)
      this.userDalService.editUserConfig(this.user.id, this.interval_inspection_key, time + '');


  }

  playState(cameraId: string) {
    return this.playing && cameraId == this.currentPlayId;
  }

  fiveTimeVideo() {
    setTimeout(() => {
      this.p.stopVideo();
      this.playing = false;
    }, 300 * 1000);/**播放5 */
  }

  async playVideo(cameraId: string) {
    this.playViewSize = domSize('item__' + cameraId);
    // const videoLive = 4;
    moveView2('item__' + cameraId, 'video__view_wrap', 0, 0);
    // const config = await this.userDalService.getUserConfig(this.user.id, videoLive + '');
    const params = new GetPreviewUrlParams();
    params.CameraId = cameraId;
    // params.Protocol = 'ws-ps';
    // params.StreamType = config? parseInt(config):1;
    const response= await this.videoService.videoUrl(params);
    // const response = await this.srRequestService.PreviewUrls(params).toPromise();

    setTimeout(() => {
      this.playing = true;
      this.currentPlayId = cameraId;
      // response.Data.Url=response.Data.Url.indexOf('password') >0 
      // ? response.Data.Url:response.Data.Url+this.user.videoUserPwd;
      const videoOptions = new HWSPlayerOptions(response.WebUrl,response.Url, '');
      this.p = new WHSPlayer(this.sanitizer);
      this.p.playVideo(videoOptions.webUrl,videoOptions.url); 
      setTimeout(() => {
        this.p.iframe=this.iframe;
        this.p.reSizeView(this.playViewSize.width, this.playViewSize.height);
        this.p.stopFn(()=>{
          this.playing = false;
          // this.player.playViewSize=this.playViewSize;
          this.btnControl('stop');
        });
        this.fiveTimeVideo();
        this.btnControl('play');
      },500);
    });

   

  }

  get items() {
    return this.model.items.get(this.model.index);

  }

  get imgs() {
    const val = this.model.items.get(this.model.index);
    if (val && val.imgDesc) {
      if (val.imgDesc.length > 4)
        return ArrayPagination<any>(1, 9, val.imgDesc);
      else return ArrayPagination<any>(val.index, 4, val.imgDesc);
    }
    return new Array();
  }

  setviewSize(num: number) {
    if (num > 4) return 33.3;
    else return 50;
  }

  /**9宫格空白填补 */
  fillBlank(n: number) {
    const arr = new Array();
    if (n > 4)
      for (let i = 0; i < 9 - n; i++)
        arr.push(1);
    else
      for (let i = 0; i < 4 - n; i++)
        arr.push(1);
    return arr;
  }

  get title() {
    const val = this.model.items.get(this.model.index);
    if (val)
      return val.title.text;
    else return '';
  }

  get titleColor() {
    const val = this.model.items.get(this.model.index);
    var color = '';
    if (val && val.title.state) {
      switch (val.title.state) {
        case '正常':
          color = 'green-text';
          break;
        case '满溢':
          color = 'orange-text'
          break;
        case '异常':
          color = 'red-text'
          break;
        default:
          break;
      }
    }
    return color;
  }

  get stateText() {
    const val = this.model.items.get(this.model.index);
    if (val && val.title.state)
      return val.title.state;
  }

  get eventNum() {
    const val = this.model.items.get(this.model.index);
    if (val)
      return val.title.eventNumber;
    else return 0;
  }

  // /**下一组图片 */
  nextImgGroup() {
    this.bigViewId='';
    this.model.index += 1;
    if (this.model.index > this.model.items.size)
      this.model.index = 1;
    this.resetCarousel(this.carousel.time);
    this.tagClick(null, false);
    this.p.stopVideo();
  }

  /**上一组图片 */
  prevImgGroup() {
    this.bigViewId='';
    this.model.index -= 1;
    if (this.model.index <= 0)
      this.model.index = this.model.items.size;
    this.resetCarousel(this.carousel.time);
    this.tagClick(null, false);
    this.p.stopVideo();
  }


  /**
   * 图片更新
   * @param param 
   * @param msg 是否弹消息
   */
  tagClick(param: string, msg: boolean) {

    if (param) {
      if (this.btnControl)this.btnControl(null);
    }
    else {
      const val = this.model.items.get(this.model.index);
      if (this.btnControl && this.model) {
        this.catchState.o = false;
        this.btnControl({
          g: val,
          msg: msg,
          catchState: this.catchState
        });
      }
    }
  }


} 