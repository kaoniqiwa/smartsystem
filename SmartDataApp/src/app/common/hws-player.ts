import { ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { VideoSimpleModel } from "../shared-module/video-simple-card/video-simple";

declare var base64encode: (str: string) => string;

export class HWSPlayer {
  iframe: ElementRef;
  playing = false;
  private WebUrl: string;
  private url: string;
  safeResourceUrl: SafeResourceUrl;
  private sanitizer: DomSanitizer;

  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  private _player: WSPlayerProxy;
  player(): WSPlayerProxy | undefined {
    if (
      !this.iframe &&
      !this.iframe.nativeElement &&
      !this.iframe.nativeElement.src
    )
      return;
    if (!this._player)
      this._player = new WSPlayerProxy(this.iframe.nativeElement);
    return this._player;
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

  getSrc(webUrl: string, url: string) {
    const result = webUrl + "?url=" + base64encode(url);
    return result;
  }

  playVideo(webUrl: string, url: string, fn?: () => void) {
    setTimeout(() => {
      this.WebUrl = webUrl;
      this.url = url;

      if (!this.url || !this.WebUrl) {
        return;
      }
      this.safeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getSrc(this.WebUrl, this.url)
      );
      this.playing = true;
    }, 300);
  }

  stopFn(fn: Function) {
    this.stop = fn;
    if (this.player())
      this.player().onButtonClicked = (btn) => {
        if (btn == "stop") {
          if (this.stop) {
            this.stop();
          }
        }
      };
  }

  stop: Function;

  fullScreen() {
    this.player().fullScreen();
  }
  stopVideo() {
    this.playing = false;
    if (this.stop) {
      this.stop();
    }
  }

  reSizeView(w?: number, h?: number) {}
}
