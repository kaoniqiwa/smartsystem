/**
 * Developer 施文斌
 * LastUpdateTime 2020/8/14
 */
import { Directive, Input, ElementRef } from '@angular/core'; 
@Directive({
    selector: '[HWSPlayer]'
})
export class HWSPlayerDirective  {

    private ele: any;
    private player_: WSPlayer;
    private    delayPlayHandle: NodeJS.Timer;
    @Input('options') options: HWSPlayerOptions;

    constructor(e: ElementRef) {
        this.ele = e.nativeElement;
    } 
    playVideo( options: HWSPlayerOptions){
        this.options=options;
        if (this.player) {
            if (this.player.status === 255) {
                this.player.url = this.options.url;
                this.player.name = this.options.name;
                this.player.play(); 
            } else {
                try {
                    this.player.stop().then(() => {
                        this.player.url =this.options.url;
                        this.player.name = this.options.name;
                        this.player.play(); 
                    });
                } catch (ex) {
                    if (this.delayPlayHandle) {
                        clearTimeout(this.delayPlayHandle);
                        this.delayPlayHandle = null;
                    }
                    this.delayPlayHandle = setTimeout(() => {
                        if (this.delayPlayHandle) {
                            clearTimeout(this.delayPlayHandle);
                            this.delayPlayHandle = null;
                        }
                        this.player.url = this.options.url;
                        this.player.name = this.options.name;
                        this.player.play(); 
                    }, 1000);
                }
            }

        } else {
            this.player = new WSPlayer({
                elementId: this.ele.id,
                url:this.options.url
            });
            this.player.name = this.options.name;
            this.player.play(); 
        }
    }

    get player() {
        return this.player_;
    }

    set player(p: WSPlayer) {
        this.player_ = p;
    }
}

export class HWSPlayerOptions {
    url: string;
    name: string;
    constructor(url: string, name: string) {
        this.url = url;
        this.name = name;
    }
}
