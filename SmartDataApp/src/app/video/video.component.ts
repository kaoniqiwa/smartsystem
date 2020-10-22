import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { VideoPlayArgs } from './mode';

declare var $: any;

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() url: string;
    @Input() cameraName: string;
    @Input() autostart: boolean;
    @ViewChild('player') element: ElementRef;

    private delayPlayHandle: NodeJS.Timer;

    private player: WSPlayer;

    guid: string = Guid.NewGuid().ToString('N');

    width: number;
    height: number;

    divId = '';

    @Output() VideoPlayingEventListen: EventEmitter<boolean> = new EventEmitter();

    constructor() {

    }
    ngAfterViewInit(): void {
        if (this.autostart) {
            this.play();
        }

    }

    formatDate(date: Date) {
        let v: number | string;
        return date.getFullYear()
            + '-'
            + ((v = (date.getMonth() + 1)) < 10 ? '0' + v : v)
            + '-'
            + ((v = date.getDate()) < 10 ? '0' + v : v);
    }

    formatTime(date: Date) {
        let v: number | string;
        return ((v = date.getHours()) < 10 ? '0' + v : v)
            + ':'
            + ((v = date.getMinutes()) < 10 ? '0' + v : v)
            + ':'
            + ((v = date.getSeconds()) < 10 ? '0' + v : v);
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
        this.divId = 'div_' + this.guid;
        setInterval(() => {
            if (this.width !== this.element.nativeElement.parentElement.offsetWidth) {
                this.width = this.element.nativeElement.parentElement.offsetWidth;
                console.log('width:', this.width);
                this.resize(this.width);
            }
            if (this.height !== this.element.nativeElement.parentElement.offsetHeight) {
                this.height = this.element.nativeElement.parentElement.offsetHeight;
                this.resize(null, this.height);
                console.log('height:', this.width);
            }
        }, 500);
    }


    createUrl(model: VideoPlayArgs) {
        // tslint:disable-next-line:max-line-length
        this.url = `ws://${model.host}:${model.port}/ws/video/howellps/${model.mode}/${model.deviceId}/${model.slot}/1/${model.mode}.mp4?user=${model.userName}&password=${model.password}"`;
        if (model.mode === 'vod') {
            // tslint:disable-next-line:max-line-length
            this.url = `ws://${model.host}:${model.port}/ws/video/howellps/${model.mode}/${model.deviceId}/${model.slot}/1/${model.beginTime}_${model.endTime}/${model.mode}.mp4?user=${model.userName}&password=${model.password}"`;
        }
        return this.url;
    }

    play(opts?: { url?: string, cameraName?: string, width?: number }) {
        if (opts) {
            if (opts.url) {
                this.url = opts.url;
            }
            if (opts.cameraName) {
                this.cameraName = opts.cameraName;
            }
            if (opts.width) {
                this.player.clientWidth = opts.width;
            }
        }


        if (!this.url) {
            return;
        }


        if (this.player) {
            if (this.player.status === 255) {
                this.player.url = this.url;
                this.player.name = this.cameraName;
                this.player.play();
                this.VideoPlayingEventListen.emit(true);
            } else {
                try {
                    this.player.stop().then(() => {
                        this.player.url = this.url;
                        this.player.name = this.cameraName;
                        this.player.play();
                        this.VideoPlayingEventListen.emit(true);
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
                        this.player.url = this.url;
                        this.player.name = this.cameraName;
                        this.player.play();
                        this.VideoPlayingEventListen.emit(true);
                    }, 1000);
                }
            }

        } else {
            this.player = new WSPlayer({
                elementId: this.divId,
                url: this.url
            });
            this.player.name = this.cameraName;
            this.player.play();
            this.VideoPlayingEventListen.emit(true);
        }

    }

    closeWindow(): void {
        if (this.player) {
            this.player.stop();
        }
        const sc = document.getElementById(this.divId);
        if (sc) { sc.parentElement.removeChild(sc); }
    }

    ngOnDestroy() {
        const sc = document.getElementById(this.divId);
        if (sc && sc.parentElement) {
            sc.parentElement.removeChild(sc);
        }
    }


}
