import { ElementRef } from "@angular/core"; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoSimpleMode } from "../shared-module/video-simple-card/video-simple";

declare var base64encode: (str: string) => string; 
 
export class  WHSPlayer {
    iframe:ElementRef;
    playing = false;
    private WebUrl:string;
    private url:string;
    safeResourceUrl: SafeResourceUrl;
    private sanitizer: DomSanitizer;
 
    
    constructor(sanitizer:DomSanitizer) {
        this.sanitizer=sanitizer;
    }


<<<<<<< HEAD
     private _player:WSPlayerProxy | undefined;
    player(): WSPlayerProxy | undefined{
        if (!this.iframe&&!this.iframe.nativeElement&&!this.iframe.nativeElement.src)
            return;
            if(!this._player)
            {
                this._player = new WSPlayerProxy(this.iframe.nativeElement);
            }
        return this._player; 
=======
     
    private _player:WSPlayerProxy;
    player(): WSPlayerProxy | undefined{
        if (!this.iframe&&!this.iframe.nativeElement&&!this.iframe.nativeElement.src)
            return; 
        if(!this._player)
            this._player = new WSPlayerProxy(this.iframe.nativeElement);        
        return this._player;
        
>>>>>>> 2ad6798029a69d5e33856d1c3633ff666f409b88
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
         this.playing = true;
        }, 300);
    }

<<<<<<< HEAD
    stopFn(fn:Function){
=======
    stopFn(fn:Function){ 
        if (this.player())
>>>>>>> 2ad6798029a69d5e33856d1c3633ff666f409b88
        this.player().onButtonClicked = (btn)=>{
            if(btn =='stop')
              fn(); 
        } 
    }

    fullScreen(){
        this.player().fullScreen();
    }
    stopVideo() {
        this.playing = false;
    }

    reSizeView(w?: number, h?: number) {
<<<<<<< HEAD
=======
        // if (this.player())
        //     if (w) this.player().resize(w, h);
        //     else this.player().resize();

>>>>>>> 2ad6798029a69d5e33856d1c3633ff666f409b88
    }
}