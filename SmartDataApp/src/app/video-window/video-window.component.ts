import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { VideoPlayArgs } from './mode';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
    selector: 'app-video-window',
    templateUrl: './video-window.component.html',
    styleUrls: ['./video-window.component.css']
})
export class VideoWindowComponent implements OnInit, OnDestroy {

    @Input() videoPlayArgs?: VideoPlayArgs;
    @Input() playMode: PlayModeEnum;
    @Input() cameraId = ''; // 00310101031111111000003001000003
    @Input() hasControl = true;
    @Input() cameraName = '';
    @Input() url: string;

    @ViewChild('date') txtDate;
    @ViewChild('begin_time') txtBeginTime;
    @ViewChild('end_time') txtEndTime;


    player: WSPlayer;
    isChangeMode = true;
    guid: string = Guid.NewGuid().ToString('N');

    @Input() videoWidth = '404px';

    beginTime: string;
    endTime: string;
    date: string;


    divId = '';

    screenId = '';

    modalWindowEmit: EventEmitter<boolean>;
    playMode_ = PlayModeEnum;
    private viewModel_: ViewModel;
    @Output() closeWindowEventListen: EventEmitter<string> = new EventEmitter();
    @Output() closeWindowOnloadEventListen: EventEmitter<string> = new EventEmitter();
    @Output() changeModeEventListen: EventEmitter<PlayModeEnum> = new EventEmitter();
    @Output() PlaybackClickedListen: EventEmitter<{ begin: Date, end: Date }> = new EventEmitter();
    @Output() VideoPlayingEventListen: EventEmitter<boolean> = new EventEmitter();

    constructor(private datePipe: DatePipe) {
        if (this.hasControl) {
            if (this.viewModel_ == null) {
                this.viewModel_ = new ViewModel();
            }
        }
        this.modalWindowEmit = new EventEmitter();
        this.modalWindowEmit.emit(true);
        const date = new Date();
        this.endTime = this.formatTime(date);
        date.setMinutes(date.getMinutes() - 5);
        this.beginTime = this.formatTime(date);
        this.date = this.formatDate(date);
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


    set videoPlayArgs_(v: any) { this.videoPlayArgs = v; }
    get viewModel() { return this.viewModel_; }


    changePlayMode(parm: PlayModeEnum, eleId: any) {
        this.playMode = parm;
        if (!this.player) { return; }
        // const ele = document.getElementById('videoWindowView');
        // switch (parm) {
        //     case PlayModeEnum.live:
        //         ele.style.width = '100%';
        //         if (this.player) {
        //             this.player.resize();
        //         }
        //         break;
        //     case PlayModeEnum.vod:
        //         ele.style.width = this.videoWidth;
        //         if (this.player) {
        //             // tslint:disable-next-line:radix
        //             this.player.resize(parseInt(this.videoWidth) - 4);
        //         }
        //         break;
        //     default:
        //         break;
        // }
        try {
            if (this.player) {
                this.player.stop();
            }
        } catch (ex) {
            console.error(ex);
        }
        // this.playMode_ = parm;
        if (!eleId) {
            this.changeModeEventListen.emit(parm);
        }

    }

    initDateTimePicker() {
        const this_ = this, getDate = (d: any) => {
            const date = new Date(d);
            return {
                beginTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0).toISOString(),
                endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59).toISOString(),
            };
        }
            , saveTime = (date: Date) => {
                const b_e = getDate(date);
                this_.viewModel.recordFilePage.beginTime = b_e.beginTime;
                this_.viewModel.recordFilePage.endTime = b_e.endTime;
            };
        if (this.playMode === this.playMode_.vod || this.playMode === this.playMode_.live) {
            const date = new Date();
            saveTime(date);
            this.searchFilesClick();
            setTimeout(() => {
                $('[data-picker="date"]').datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 0,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    language: 'zh-CN',
                    initialDate: date
                }).on('changeDate', function (ev) {
                    saveTime(ev.date);

                });
            });
        }
    }

    initPresetList() {
        this.viewModel.PTZ.presetControl = new Array();
        for (let i = 1; i <= 255; i++) { this.viewModel.PTZ.presetControl.push(new PresetControl(i, false)); }
    }

    videoItemClick(item: any) {
        if (this.videoPlayArgs && this.videoPlayArgs.deviceId) {
            // if(item.beginTime)
            this.videoPlayArgs.beginTime = new Date(item.beginTime).toISOString();
            // if(item.endTime)
            this.videoPlayArgs.endTime = new Date(item.endTime).toISOString();
            this.playVideo();
            for (const f of this.viewModel.recordFilePage.list) {
                f.isSelect = false;
            }
            item.isSelect = true;
        }
    }

    ngOnInit() {
        const me = this;


        document.addEventListener('fullscreenchange', () => {
            const ele = document.getElementById('videoWindowView');
            if (ele.offsetWidth <= 900 && ele.offsetHeight <= 1200) {
                ele.setAttribute('data-full', '0');
            }
        });
        if (me.hasControl) {
            me.initDateTimePicker();
            me.initPresetList();
            setTimeout(() => {
                $('#ra__').rangeslider({
                    polyfill: false,
                    rangeClass: 'rangeslider',
                    horizontalClass: 'rangeslider--horizontal',
                    fillClass: 'rangeslider__fill',
                    handleClass: 'rangeslider__handle',
                    onSlide: function (position, value) {
                        me.viewModel.PTZ.speed = value;
                    }
                });
            });
            setTimeout(() => {
                if (me.playMode === me.playMode_.live) {
                    me.playVideo();
                }

            }, 1200);
        } else {
            me.playVideo();
        }
    }

    initPlayBackView() {
        this.initDateTimePicker();
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

    playVideo() {
        const me = this;
        me.divId = 'div' + me.guid;
        me.screenId = 'screen' + me.guid;

        if (me.videoPlayArgs) {
            me.url = this.createUrl(me.videoPlayArgs);
        }
        if (this.player) {
            if (this.player.status === 255) {
                this.player.url = this.url;
                this.player.name = this.cameraName;
                this.player.play();
                this.VideoPlayingEventListen.emit(true);
            } else {
                this.player.stop().then(() => {
                    this.player.url = this.url;
                    this.player.name = this.cameraName;
                    this.player.play();
                    this.VideoPlayingEventListen.emit(true);
                });
            }

        } else {
            this.player = new WSPlayer({
                elementId: this.divId,
                url: me.url
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
        const sc = document.getElementById(this.guid);
        if (sc) { sc.parentElement.removeChild(sc); }
        if (this.closeWindowEventListen) {
            this.closeWindowEventListen.emit('');
        }
        this.modalWindowEmit.emit(false);
    }

    ngOnDestroy() {
        const sc = document.getElementById(this.guid);
        if (sc && sc.parentElement) {
            sc.parentElement.removeChild(sc);
        }
        this.closeWindowOnloadEventListen.emit('closed');
    }

    async loadRecordFileList(playMode: PlayModeEnum,
        cameraId: string, beginTime: string, endTime: string, pageIndex: number, pageSize: number) {
        if (cameraId && beginTime && endTime && playMode === PlayModeEnum.vod) {
            // const pagedList = await this.videoSecurityDALService.getRecordsFiles(cameraId, pageIndex, pageSize, beginTime, endTime);
            // if (pagedList) {
            //     for (const d of pagedList.Data) {
            //         if (d.BeginTime && d.EndTime) {
            //             const text = this.datePipe.transform(d.BeginTime, 'HH:mm:ss')
            //                 + ' - '
            //                 + this.datePipe.transform(d.EndTime, 'HH:mm:ss');
            //             this.viewModel.recordFilePage.list.push(new PlayBackFile(text, d.BeginTime, d.EndTime));
            //         }
            //     }
            // }
        }
    }




    presetListItemClick(item: any) {
        for (const x of this.viewModel.PTZ.presetControl) { x.isSelect = false; }
        item.isSelect = true;
    }
    videoFullscreen() {
        const element = document.getElementById('videoWindowView');
        if (element.requestFullscreen && this.viewModel.isFillVideo === false) {
            this.viewModel.isFillVideo = true;
            element.requestFullscreen();
            return;
        }
        if (this.viewModel.isFillVideo) {
            document.exitFullscreen();
            this.viewModel.isFillVideo = false;
        }
    }
    searchFilesClick() {
        this.viewModel.recordFilePage.list = [];
        this.loadRecordFileList(this.playMode, this.cameraId, this.viewModel.recordFilePage.beginTime
            , this.viewModel.recordFilePage.endTime, this.viewModel.recordFilePage.index, 20);
    }
    loadMoreFiles() {
        this.loadRecordFileList(this.playMode, this.cameraId, this.viewModel.recordFilePage.beginTime
            , this.viewModel.recordFilePage.endTime, this.viewModel.recordFilePage.index, 20);
    }

    changeSpeed(v: string) {
        const m = v.match(/^\d{1,7}$/);
        if (m != null) {
            // tslint:disable-next-line:radix
            this.viewModel.PTZ.speed = Number.parseInt(v);
        } else { this.viewModel.PTZ.speed = 1; }
        $('#ra__').val(this.viewModel.PTZ.speed);
        $('#ra__').trigger('change');
    }

    playback_click() {
        const date = document.getElementById('txt_date') as HTMLInputElement;
        const begin = document.getElementById('txt_begin_time') as HTMLInputElement;
        const end = document.getElementById('txt_end_time') as HTMLInputElement;

        this.PlaybackClickedListen.emit({
            begin: new Date(date.value + ' ' + begin.value),
            end: new Date(date.value + ' ' + end.value)
        });
    }

}

export enum PlayModeEnum {
    vod = 'vod',
    live = 'live'
}

enum DirectionEnum {
    stop,
    up,
    down,
    left,
    right,
    up_left,
    up_right,
    down_left,
    down_right
}

enum LensEnum {
    stop,
    halo_on,
    halo_off,
    zoom_in,
    zoom_out,
    far,
    unfar
}

enum RresetEnum {
    clear,
    set,
    do
}

class ViewModel {
    clickTag = false;
    isFillVideo = false;
    recordFilePage = {
        index: 1,
        beginTime: '',
        endTime: '',
        list: new Array()

    };
    PTZ = {
        direction: DirectionEnum,
        reset: RresetEnum,
        len: LensEnum,
        speed: 4,
        presetControl: new Array()
    };
    scroll = {
        // 滚动条组件参数
        throttle: 300,
        scrollDistance: 1,
        scrollUpDistance: 2,
        scrollWindow: false
    };
}
class PlayBackFile {
    labelText: string;
    beginTime: string;
    endTime: string;
    isSelect: boolean;
    constructor(labelText: string, beginTime: string, endTime: string) {
        this.labelText = labelText;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.isSelect = false;
    }
}

class PresetControl {
    no: number;
    isSet: boolean;
    constructor(no: number, isSet: boolean) {
        this.no = no;
        this.isSet = isSet;
    }
}
