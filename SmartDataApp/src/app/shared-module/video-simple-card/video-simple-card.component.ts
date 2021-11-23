/**
 * Developer 施文斌
 * LastUpdateTime  2021/4/19
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { VideoMode, VideoSimpleModel } from "./video-simple";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HowellUri } from "src/app/common/howell-uri";

@Component({
  selector: "hw-video-simple-card",
  templateUrl: "./video-simple-card.component.html",
  styleUrls: ["./video-simple-card.component.css"],
  providers: [],
})
export class VideoSimpleCardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  mode: VideoMode;

  @ViewChild("iframe") iframe: ElementRef<HTMLIFrameElement>;

  if(cameraName) {
    this.secondName = cameraName;
  }
  _url: string;
  @Input()
  set url(val: string) {
    this._url = val;
  }
  get url() {
    return this._url;
  }
  @Input() cameraName: string;
  @Input() autostart: boolean;
  @Input() closeFn: () => void;
  @Input() videoImgs: {
    id: string;
    imgSrc: string;
    name: string;
    time: Date | string;
  }[];
  @Input() playVideoToUrlFn: (
    id: string,
    time: Date | string,
    cb: (webUrl: string, url: string) => void
  ) => void;
  @Input() bottomTool: {
    left: { label: string; color: string }[];
    right: { label: string; color: string }[];
  };

  private _srcUrl: SafeResourceUrl;
  private get srcUrl(): SafeResourceUrl {
    return this._srcUrl;
  }
  private set srcUrl(val: SafeResourceUrl) {
    this._srcUrl = val;
  }

  @Input()
  WebUrl: string;

  private _player: WSPlayerProxy;
  private get player(): WSPlayerProxy {
    if (!this.iframe || !this.iframe.nativeElement.src) return;
    if (!this._player) {
      this._player = new WSPlayerProxy(this.iframe.nativeElement);
    }
    return this._player;
  }
  private secondName = "";

  playing = false;

  guid: string = Guid.NewGuid().ToString("N");

  @Input() videoWidth = "404px";

  divId = "";

  @Output() VideoPlayingEventListen: EventEmitter<boolean> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {}
  ngAfterViewInit(): void {
    if (this.autostart) {
      this.play(this.WebUrl, this.url, this.cameraName);
    }
  }

  playerRegistEvent() {
    if (this.player) {
      this.player.onButtonClicked = (btn: ButtonName) => {};
    } else {
      setTimeout(() => {
        this.playerRegistEvent();
      }, 100);
    }
  }

  on_iframe_unload() {
    console.log("iframe onunload");
  }

  on_iframe_load() {
    console.log("iframe load");
    // this.playerRegistEvent();
  }

  formatDate(date: Date) {
    let v: number | string;
    return (
      date.getFullYear() +
      "-" +
      ((v = date.getMonth() + 1) < 10 ? "0" + v : v) +
      "-" +
      ((v = date.getDate()) < 10 ? "0" + v : v)
    );
  }

  formatTime(date: Date) {
    let v: number | string;
    return (
      ((v = date.getHours()) < 10 ? "0" + v : v) +
      ":" +
      ((v = date.getMinutes()) < 10 ? "0" + v : v) +
      ":" +
      ((v = date.getSeconds()) < 10 ? "0" + v : v)
    );
  }

  seek(value: number) {
    this.player.seek(value);
  }
  // 快进
  fast() {
    this.player.fast();
  }
  // 慢放
  slow() {
    this.player.slow();
  }
  // 截图
  capturePicture() {
    this.player.capturePicture();
  }
  // 暂停
  pause() {
    this.player.pause();
  }
  speedResume() {
    this.player.speedResume();
  }
  // 恢复
  resume() {
    this.player.resume();
  }
  // 单帧
  frame() {
    this.player.frame();
  }
  // 停止
  stop(): Promise<void> {
    return this.player.stop();
  }
  // 全屏
  fullScreen(): void {
    this.player.fullScreen();
  }
  resize(width?: number, height?: number): void {
    this.player.resize(width, height);
  }
  download(filename: string, type: string): void {
    this.player.download(filename, type);
  }

  ngOnInit() {
    this.divId = "div_" + this.guid;
  }

  simpleVideoClick(id: string, name: string, time: Date | string) {
    this.playVideoToUrlFn(id, time, (webUrl, url) => {
      this.play(webUrl, url, name);
      setTimeout(() => {
        if (this.player) {
          this.player.getPosition = (val: any) => {
            if (val >= 1) {
              this.playing = false;
            }
          };
        }
      }, 100);
    });
  }

  createUrl(model: VideoSimpleModel) {
    // tslint:disable-next-line:max-line-length
    this.url = `ws://${model.host}:${model.port}/ws/video/howellps/${model.mode}/${model.deviceId}/${model.slot}/1/${model.mode}.mp4?user=${model.userName}&password=${model.password}"`;
    if (model.mode === "vod") {
      // tslint:disable-next-line:max-line-length
      this.url = `ws://${model.host}:${model.port}/ws/video/howellps/${model.mode}/${model.deviceId}/${model.slot}/1/${model.beginTime}_${model.endTime}/${model.mode}.mp4?user=${model.userName}&password=${model.password}"`;
    }
    return this.url;
  }

  getSrc(webUrl: string, url: string, cameraName?: string) {
    let result = webUrl + "?url=" + base64encode(url);
    if (cameraName) {
      let name = utf16to8(cameraName);
      result += "&name=" + base64encode(name);
    }
    return result;
  }

  play(webUrl: string, url: string, cameraName?: string, save = true) {
    setTimeout(() => {
      if (!url || !webUrl) {
        return;
      }
      this.mode =
        url.indexOf(VideoMode.vod) < 0 ? VideoMode.live : VideoMode.vod;

      if (save) {
        this.WebUrl = webUrl;
        this.url = url;
        if (cameraName) {
          this.secondName = cameraName;
        }
      }

      console.log(this.getSrc(webUrl, url, cameraName));

      this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getSrc(webUrl, url, cameraName)
      );
      this.VideoPlayingEventListen.emit(true);
    }, 100);

    setTimeout(() => {
      this.playing = true;
    }, 110);

    // const size = domSize(this.divId);
    // this.player.clientWidth = size.width;
    // this.player.clientHeight = size.height;
  }

  closeWindow(): void {
    this.mode = undefined;
    if (this.playing && this.videoImgs) {
      this.playing = false;
      this.secondName = "";
    } else {
      const sc = document.getElementById(this.divId);
      if (sc) {
        sc.parentElement.removeChild(sc);
      }
      if (this.closeFn) this.closeFn();
    }
  }

  /**9宫格空白填补 */
  fillBlank(n: number) {
    const arr = new Array();
    if (n < 4) for (let i = 0; i < 4 - n; i++) arr.push(1);
    return arr;
  }

  ngOnDestroy() {
    const sc = document.getElementById(this.divId);
    if (sc && sc.parentElement) {
      sc.parentElement.removeChild(sc);
    }
    // const sc = document.getElementById(this.divId);
    // if (sc && sc.parentElement) {
    //     sc.parentElement.removeChild(sc);
    // }
  }

  preview(event: Event) {
    let model = new VideoSimpleModel(this.url);
    let url = model.toString();
    this.play(this.WebUrl, url, this.cameraName, false);
  }
}
