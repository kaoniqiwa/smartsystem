/**
 * Developer 施文斌
 * LastUpdateTime 2020/8/14
 */
import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { HWSPlayer } from "../tool/wsplayer/wsplayer";
@Directive({
    selector: '[HWSPlayer]'
})
export class HWSPlayerDirective implements OnChanges {

    private ele: any;
    private player_: HWSPlayer;
    @Input('options') options: HWSPlayerOptions;

    constructor(e: ElementRef) {
        this.ele = e.nativeElement;
    }
    ngOnChanges(changes: SimpleChanges): void { 
        this.player_ = new HWSPlayer(this.ele.id, this.options.url, this.options.name);
    }

    get player() {
        return this.player_;
    }

    set player(p: HWSPlayer) {
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
