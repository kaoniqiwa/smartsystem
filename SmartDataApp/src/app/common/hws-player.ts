import { ElementRef } from "@angular/core"; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoSimpleMode } from "../shared-module/video-simple-card/video-simple";

declare var base64encode: (str: string) => string; 
 
export class  WHSPlayer {
    iframe:ElementRef;
    private WebUrl:string;
    private url:string;
    safeResourceUrl: SafeResourceUrl;
    private sanitizer: DomSanitizer;
 
    
    constructor(sanitizer:DomSanitizer) {
        this.sanitizer=sanitizer;
    }


     
    player(): WSPlayer | undefined{
        if (!this.iframe&&!this.iframe.nativeElement&&!this.iframe.nativeElement.src)
            return;
        return this.iframe.nativeElement.player; 
    }


    createUrl(model: VideoSimpleMode) {
        // tslint:disable-next-line:max-line-length
        this.url = `ws://${model.host}:${model.port}/ws/video/howellps/${model.mode}/${model.deviceId}/${model.slot}/1/${model.mode}.mp4?user=${model.userName}&password=${model.password}"`;
        if (model.mode === 'vod') {
            // tslint:disable-next-line:max-line-length
            this.url = `ws://${model.host}:${model.port}/ws/video/howellps/${model.mode}/${model.deviceId}/${model.slot}/1/${model.beginTime}_${model.endTime}/${model.mode}.mp4?user=${model.userName}&password=${model.password}"`;
        }
        return this.url;
    }



    getSrc(webUrl:string, url: string) { 
        const result = webUrl + '?url=' + base64encode(url);        
        return result;
    }

    playVideo(webUrl:string, url: string, fn?: () => void) {
        setTimeout(() => {
            this.WebUrl = webUrl;
        this.url = url;
    
        if (!this.url || !this.WebUrl) {
            return;
        }     
        this.safeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc(this.WebUrl, this.url));
         
        }, 300);
    }

    stopFn(fn:Function){debugger
        this.player().onButtonClicked = (btn)=>{
            if(btn =='stop')
              fn(); 
        } 
    }

    fullScreen(){
        this.player().fullScreen();
    }
    stopVideo() {
        if(this.player())
        this.player().stop();
    }

    reSizeView(w?: number, h?: number) {
        if (this.player())
            if (w) this.player().resize(w, h);
            else this.player().resize();

    }
}