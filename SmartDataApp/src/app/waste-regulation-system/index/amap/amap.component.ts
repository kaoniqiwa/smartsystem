import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
    CameraRequestService as AIOPCameraService,
    ResourceMediumRequestService,
    ResourceSRServersRequestService
} from '../../../data-core/repuest/resources.service';
import { GarbageStation, GetGarbageStationsParams } from '../../../data-core/model/waste-regulation/garbage-station';
import {
    CameraRequestService as GarbageStationCameraRequestService, GarbageStationRequestService
} from '../../../data-core/repuest/garbage-station.service';
import { Camera, CameraState } from '../../../data-core/model/aiop/camera';
import { GetPreviewUrlParams, GetVodUrlParams } from '../../../data-core/model/aiop/video-url';
import { PlayModeEnum, VideoWindowComponent } from '../../../video-window/video-window.component';

import { AMapService } from './amap.service';
import { EventPushService } from '../../../common/tool/mqtt-event/event-push.service';


declare var $: any;

@Component({
    selector: 'app-amap',
    templateUrl: './amap.component.html',
    styleUrls: ['./amap.component.css'],
    providers: [AMapService]
})
export class AMapComponent implements AfterViewInit, OnInit {
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('videoWindow')
    videoWindow: VideoWindowComponent;

    @ViewChild('villageTreeList')
    villageTreeList: any;



    @Output()
    mapLoadedEvent: EventEmitter<CesiumMapClient> = new EventEmitter();

    isShowVideoView = false;
    currentCamera: Camera;
    maskLayerShow = false;
    selectedCameras: Camera[];
    garbages: GarbageStation[];

    srcUrl: any;
    dataController: CesiumDataController.Controller;
    client: CesiumMapClient;

    autoCloseWindowHandle: NodeJS.Timer;
    constructor(
        private amapService: AMapService,
        private sanitizer: DomSanitizer,
        private changeDetectorRef: ChangeDetectorRef,
        private garbageService: GarbageStationRequestService,
        private aiopCameraService: AIOPCameraService,
        private mediaService: ResourceMediumRequestService,
        private cameraService: GarbageStationCameraRequestService,
        private srService: ResourceSRServersRequestService,
        private eventService: EventPushService
    ) {

        this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());
        // this.eventService.pushIllegalDrop.subscribe(async (event: IllegalDropEventRecord) => {
        //     const response = await this.garbageService.get(event.Data.StationId).toPromise();
        //     const status = {
        //         id: event.Data.StationId,
        //         status: 0
        //     };
        //     if (response.Data.DryFull || response.Data.WetFull) {
        //         status.status = 1;
        //     }
        //     this.client.Point.Status([status]);
        // });
        setInterval(() => {
            this.refresh();
        }, 1 * 60 * 1000);
    }

    getSrc() {
        const host = document.location.hostname;
        const port = document.location.port;
        return 'http://' + host + ':' + port + '/amap/map_ts.html?v=20200925';
    }

    async refresh() {
        const response = await this.garbageService.list(new GetGarbageStationsParams()).toPromise();

        this.garbages = response.Data.Data;

        const arrayStatus = new Array();
        for (let i = 0; i < this.garbages.length; i++) {
            const garbage = this.garbages[i];
            try {
                if (this.garbages[i].StationState > 0) {
                    const status = {
                        id: this.garbages[i].Id,
                        status: this.garbages[i].StationState === 1 ? 1 : 2
                    };
                    console.log(status);
                    arrayStatus.push(status);
                }
            } catch (ex) {
                console.error(ex);
            }
        }
        this.client.Point.Status(arrayStatus);
    }


    ngOnInit() {


        // Detect effects of NgForTrackBy
        this.client = new CesiumMapClient(this.iframe.nativeElement);
        this.client.Events.OnLoading = () => {
            this.dataController = this.client.DataController;
        };
        this.client.Events.OnLoaded = () => {

            console.log('this.client.Events.OnLoaded');

            this.refresh();

            const villages = this.dataController.Village.List();
            for (const villageId in villages) {
                if (Object.prototype.hasOwnProperty.call(villages, villageId)) {
                    const village = villages[villageId];
                    if (!village.parentId) {
                        this.client.Viewer.MoveTo(village.center);
                        break;
                    }
                }
            }

            this.mapLoadedEvent.emit(this.client);

        };

        this.client.Events.OnElementsDoubleClicked = async (objs) => {
            if (!objs || objs.length <= 0) { return; }
            const id = objs[0].id;
            const list = document.getElementsByClassName('map-bar video-list')[0];
            if (list && objs && objs.length > 0) {

                try {
                    const response = await this.cameraService.list(id).toPromise();
                    const datas = response.Data.sort((a, b) => {
                        return a.Name.length - b.Name.length || a.Name.localeCompare(b.Name);
                    });
                    const p = datas.map(async x => {
                        const camera_response = await this.aiopCameraService.get(x.Id).toPromise();
                        return camera_response.Data;
                    });
                    this.selectedCameras = [];
                    for (let i = 0; i < datas.length; i++) {
                        try {
                            const camera_response = await this.aiopCameraService.get(datas[i].Id).toPromise();
                            if (camera_response) {
                                if (camera_response.Data.ImageUrl) {
                                    camera_response.Data.ImageUrl = this.mediaService.getData(camera_response.Data.ImageUrl);
                                } else {
                                    camera_response.Data.ImageUrl = 'assets/img/timg.png';
                                }

                                this.selectedCameras.push(camera_response.Data);
                            }
                            switch (camera_response.Data.CameraState) {
                                case CameraState.DeviceError:
                                    camera_response.Data.Name += ' 设备故障';
                                    break;
                                case CameraState.PlatformError:
                                    camera_response.Data.Name += ' 平台故障';
                                    break;
                                default:
                                    break;
                            }
                        } catch (ex) {
                            console.error(ex);
                        }
                    }


                    this.changeDetectorRef.markForCheck();
                    this.changeDetectorRef.detectChanges();
                } catch (ex) {
                    console.error(ex);
                }
                finally {
                    list['style'].display = 'block';
                }

            }

            $('.ul').each(function (index, element) {
                element.onwheel = function (event) {
                    const table = $(element).parents('.video-list');
                    const right = $(element).width() - table[0].offsetWidth;
                    if (table.scrollLeft() <= right && event.deltaY > 0) {
                        // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                        event.preventDefault();
                        const left = (table.scrollLeft() + 50);
                        table.scrollLeft(left);
                    }
                    if (table.scrollLeft() >= 0 && event.deltaY < 0) {
                        // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                        event.preventDefault();
                        const left = (table.scrollLeft() - 50);
                        table.scrollLeft(left);
                    }
                };
            });



        };
        this.client.Events.OnElementsClicked = function (objs) {
            const list = document.getElementsByClassName('map-bar video-list')[0];
            list['style'].display = 'none';
        };

        this.client.Events.OnVillageClicked = (village: CesiumDataController.Village) => {
            const list = document.getElementsByClassName('map-bar video-list')[0];
            list['style'].display = 'none';
        };
    }
    ngAfterViewInit() {

    }

    OnImageError(evt: Event) {
        (evt.currentTarget as HTMLImageElement).src = 'assets/img/timg.png';
    }

    OnVillageWindowClosed() {
        if (this.autoCloseWindowHandle) {
            clearTimeout(this.autoCloseWindowHandle);
        }
        const element = document.getElementById('videoPlayer');
        element.style.display = 'none';
        this.videoWindow.changePlayMode(PlayModeEnum.live, true);
    }

    async OnCameraClicked(camera: Camera) {
        if (!camera || !camera.SRSId) { return; }
        try {

            this.videoWindow.changePlayMode(PlayModeEnum.live, true);

            this.currentCamera = camera;
            this.maskLayerShow = true;
            this.isShowVideoView = true;
            const element = document.getElementById('videoPlayer');
            element.style.display = '';

            console.log(camera);
            const params = new GetPreviewUrlParams();
            params.CameraId = camera.Id;
            params.Protocol = 'ws-ps';
            params.StreamType = 1;
            const response = await this.srService.PreviewUrls(params).toPromise();

            this.amapService.videoPlayerService.playCameraName = camera.Name;
            this.amapService.videoPlayerService.playMode = PlayModeEnum.live;
            this.amapService.videoPlayerService.playVideoVideoId = 'player';

            this.amapService.videoPlayerService.url = response.Data.Url;
            this.videoWindow.url = response.Data.Url;
            this.videoWindow.cameraName = camera.Name;
            this.videoWindow.playVideo();
        } catch (ex) {
            console.error(ex);
        }
    }

    Playback(camera: Camera, begin: Date, end: Date) {
        if (!camera) { return; }
        this.videoWindow.changePlayMode(PlayModeEnum.vod, false);
        const element = document.getElementById('videoPlayer');
        element.style.display = '';
        this.currentCamera = camera;
        this.PlaybackClicked({ begin: begin, end: end });
    }




    autoCloseWindow() {
        if (this.autoCloseWindowHandle) {
            clearTimeout(this.autoCloseWindowHandle);
        }
        this.autoCloseWindowHandle = setTimeout(() => {
            this.videoWindow.closeWindow();
        }, 5 * 60 * 1000);
    }



    async changePlayMode(mode: PlayModeEnum) {
        try {

            if (this.autoCloseWindowHandle) {
                clearTimeout(this.autoCloseWindowHandle);
            }

            this.videoWindow.playMode = mode;
            if (mode === PlayModeEnum.live) {
                const params = new GetPreviewUrlParams();
                params.CameraId = this.currentCamera.Id;
                params.Protocol = 'ws-ps';
                params.StreamType = 1;
                const response = await this.srService.PreviewUrls(params).toPromise();
                this.videoWindow.url = response.Data.Url;
                this.videoWindow.cameraName = this.currentCamera.Name;
                this.videoWindow.playVideo();
            }

        } catch (ex) {
            console.error(ex);
        }
    }

    async PlaybackClicked(opts: { begin: Date, end: Date }) {
        try {
            const params = new GetVodUrlParams();
            params.BeginTime = opts.begin;
            params.EndTime = opts.end;
            params.Protocol = 'ws-ps';
            params.StreamType = 1;
            params.CameraId = this.currentCamera.Id;
            const response = await this.srService.VodUrls(params).toPromise();
            this.videoWindow.url = response.Data.Url;
            this.videoWindow.cameraName = this.currentCamera.Name;
            this.videoWindow.playVideo();
        } catch (ex) {
            console.error(ex);
        }
    }

    OnVideoPlaying(playing: boolean) {
        console.log('OnVideoPlaying', playing);
        if (playing) {
            this.autoCloseWindow();
        }
    }



}

