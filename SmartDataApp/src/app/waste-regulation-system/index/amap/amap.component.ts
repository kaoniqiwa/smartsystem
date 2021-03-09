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
import { GetPreviewUrlParams, GetVodUrlParams } from '../../../data-core/model/aiop/video-url';
import { PlayModeEnum, VideoWindowComponent } from '../../../video-window/video-window.component';

import { AMapService } from './amap.service';
import { DivisionRequestService } from '../../../data-core/repuest/division.service';
import { Division, GetDivisionsParams } from '../../../data-core/model/waste-regulation/division';
import { PagedList } from '../../../data-core/model/page';
import { Response } from '../../../data-core/model/Response';
import { MapListItem, MapListItemType } from './map-list-panel/map-list-item';
import { Camera } from '../../../data-core/model/waste-regulation/camera';
import { SessionUser } from '../../../common/tool/session-user';
import { GetDivisionStatisticNumbersParams } from 'src/app/data-core/model/waste-regulation/division-number-statistic';
import { GetGarbageStationStatisticNumbersParams } from 'src/app/data-core/model/waste-regulation/garbage-station-number-statistic';

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

    @ViewChild('video_list_prev') video_list_prev: ElementRef;
    @ViewChild('video_list_next') video_list_next: ElementRef;



    @Output()
    mapLoadedEvent: EventEmitter<CesiumMapClient> = new EventEmitter();
    @Output()
    patrolButtonClicked: EventEmitter<void> = new EventEmitter();
    @Output()
    vsButtonClicked: EventEmitter<void> = new EventEmitter();
    @Output()
    mapPanelListItemClickedEvent: EventEmitter<MapListItem<Division | GarbageStation>> = new EventEmitter();

    labelNumber = 0;
    labels: Global.Dictionary<CesiumDataController.LabelOptions> = {};
    labelHandle: NodeJS.Timer;
    // label 显示
    labelVisibility = false;
    set LabelVisibility(val: boolean) {
        this.labelVisibility = val;
        if (val) {
            this.client.Label.Show();
            this.setLabel(this.garbages);
            this.labelHandle = setInterval(() => {
                this.setLabel(this.garbages);
            }, 1 * 60 * 1000);
        } else {
            this.client.Label.Hide();
            clearInterval(this.labelHandle);
        }
    }
    get LabelVisibility() {
        return this.labelVisibility;
    }

    isShowVideoView = false;
    currentCamera: Camera;
    maskLayerShow = false;
    selectedCameras: Camera[];
    garbages: GarbageStation[];

    villageGarbages: GarbageStation[];

    private baseDivisionId: string;
    private points: Global.Dictionary<CesiumDataController.Point> = {};

    srcUrl: any;
    dataController: CesiumDataController.Controller;
    client: CesiumMapClient;
    user = new SessionUser();
    autoCloseWindowHandle: NodeJS.Timer;
    constructor(
        private amapService: AMapService,
        private sanitizer: DomSanitizer,
        private changeDetectorRef: ChangeDetectorRef,
        private garbageService: GarbageStationRequestService,
        private divisionService: DivisionRequestService,
        private mediaService: ResourceMediumRequestService,
        private cameraService: GarbageStationCameraRequestService,
        private srService: ResourceSRServersRequestService
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
        return 'http://' + host + ':' + port + '/amap/map_ts.html?v=' + new Date().format('yyyyMMddHHmmss');
    }

    async refresh() {
        const response = await this.garbageService.list(new GetGarbageStationsParams()).toPromise();

        this.garbages = response.Data.Data;
        if (!this.villageGarbages) {
            this.villageGarbages = this.garbages;
        }
        this.setPointStatus(this.garbages);

    }

    async setLabel(stations: GarbageStation[]) {
        const params = new GetGarbageStationStatisticNumbersParams();
        params.Ids = stations.map(x => x.Id);
        const list = await this.garbageService.statisticNumberList(params).toPromise();

        const opts = new Array();
        for (let i = 0; i < list.Data.Data.length; i++) {
            const data = list.Data.Data[i];

            if (data.CurrentGarbageTime > 0) {
                const point = this.points[data.Id];
                const opt = new CesiumDataController.LabelOptions();
                opt.position = point.position;
                opt.id = point.id;

                const p = data.CurrentGarbageTime / 240;

                console.log(data);
                const hours = parseInt((data.CurrentGarbageTime / 60).toString());
                const minutes = parseInt((Math.ceil(data.CurrentGarbageTime) % 60).toString());

                opt.text = (hours ? hours + '小时' : (minutes ? minutes + '分钟' : ''));

                const color = new CesiumDataController.Color();
                color.rgb = '#36e323';
                color.hsl = new CesiumDataController.HSL();
                color.hsl.h = 120 - parseInt((p * 90).toString());
                color.hsl.s = 100;
                color.hsl.l = 60;

                opt.color = color;
                opt.value = p;
                if (opt.text) {
                    opt.image = new CesiumDataController.ImageOptions();
                    opt.image.color = color;
                    opt.image.value = p;
                    opt.image.resource = CesiumDataController.ImageResource.arcProgress;
                }
                opts.push(opt);
                this.labels[opt.id] = opt;
            }
        }

        const ids = opts.map(x => x.id);

        this.client.Label.Set(opts);
        for (const id in this.labels) {
            if (Object.prototype.hasOwnProperty.call(this.labels, id)) {
                const label = this.labels[id];
                if (label.value === 0 || !ids.includes(id)) {
                    this.client.Label.Remove(id);
                    delete this.labels[id];
                }
            }
        }
    }

    setPointStatus(stations: GarbageStation[]) {
        const arrayStatus = new Array();
        for (let i = 0; i < stations.length; i++) {
            const station = stations[i];
            try {
                const status = {
                    id: station.Id,
                    status: 0
                };
                if (station.StationState > 0) {
                    status.status = station.StationState === 1 ? 1 : 2;
                }

                arrayStatus.push(status);
            } catch (ex) {
                console.error(ex);
            }
        }
        console.log(arrayStatus);
        this.client.Point.Status(arrayStatus);
    }

    async getBaseDivision() {
        const params = new GetDivisionsParams();
        params.DivisionType = 3;
        const response = await this.divisionService.list(params).toPromise();
        if (response.Data.Page.TotalRecordCount > 0) {
            return response.Data.Data[0];
        }
    }

    ngOnInit() {


        // Detect effects of NgForTrackBy
        this.client = new CesiumMapClient(this.iframe.nativeElement);
        this.client.Events.OnLoading = async () => {
            this.dataController = this.client.DataController;
            const response = await this.garbageService.list(new GetGarbageStationsParams()).toPromise();

            this.garbages = response.Data.Data;
            if (!this.villageGarbages) {
                this.villageGarbages = this.garbages;
            }

            for (let i = 0; i < this.garbages.length; i++) {
                const point = this.dataController.Village.Point.Get(this.garbages[i].DivisionId, this.garbages[i].Id);
                if (point) {
                    this.points[point.id] = point;
                    if (point.name !== this.garbages[i].Name) {
                        point.name = this.garbages[i].Name;
                        this.dataController.Village.Point.Update(this.garbages[i].DivisionId, this.garbages[i].Id, point);
                    }
                }
            }
        };
        this.client.Events.OnLoaded = async () => {

            console.log('this.client.Events.OnLoaded');

            setTimeout(() => {
                if (this.mapLoadedEvent) {
                    this.mapLoadedEvent.emit(this.client);
                }
            }, 0);


            const p = this.getBaseDivision();
            p.then((baseDivision) => {
                this.baseDivisionId = baseDivision.Id;
                this.client.Village.Select(baseDivision.Id, true);
                this.refresh();

                const village = this.dataController.Village.Get(baseDivision.Id);
                this.client.Viewer.MoveTo(village.center);
            });

            this.LabelVisibility = false;
        };


        this.client.Events.OnMouseClick = async (position) => {

        };
        this.client.Events.OnMouseDoubleClick = async (position) => {

        };
        this.client.Events.OnElementsClicked = async (objs) => {

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

                    this.selectedCameras = [];
                    for (let i = 0; i < datas.length; i++) {
                        try {
                            const camera = datas[i];
                            if (camera) {
                                if (camera.ImageUrl) {
                                    camera.ImageUrl = this.mediaService.getData(camera.ImageUrl);
                                } else {
                                    camera.ImageUrl = 'assets/img/timg.png';
                                }
                                this.selectedCameras.push(camera);
                            }

                        } catch (ex) {
                            console.error(ex);
                        }
                    }

                    if (this.selectedCameras.length > 5) {
                        this.video_list_next.nativeElement.style.display = '';
                        this.video_list_prev.nativeElement.style.display = '';
                    } else {
                        this.video_list_next.nativeElement.style.display = 'none';
                        this.video_list_prev.nativeElement.style.display = 'none';
                    }



                    this.changeDetectorRef.markForCheck();
                    this.changeDetectorRef.detectChanges();
                } catch (ex) {
                    console.error(ex);
                }
                finally {
                    list['style'].display = 'block';
                    const status = document.getElementsByClassName('map-bar status')[0];
                    status['style'].display = 'none';
                }

            }

            $('.ul').each(function (index, element) {
                element.onwheel = function (event) {
                    const table = $(element).parents('.video-list');
                    const right = $(element).width() - table[0].offsetWidth;
                    if (table.scrollLeft() <= right && event.deltaY > 0) {
                        // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        const left = (table.scrollLeft() + 50);
                        table.scrollLeft(left);
                    }
                    if (table.scrollLeft() >= 0 && event.deltaY < 0) {
                        // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        const left = (table.scrollLeft() - 50);
                        table.scrollLeft(left);
                    }
                };
            });
        };

        this.video_list_prev.nativeElement.onclick = () => {
            $('.ul')[0].onwheel({ deltaY: -1 });
        };

        this.video_list_next.nativeElement.onclick = () => {
            $('.ul')[0].onwheel({ deltaY: 1 });
        };


        this.client.Events.OnElementsClicked = function (objs) {
            const status = document.getElementsByClassName('map-bar status')[0];
            status['style'].display = '';

            const list = document.getElementsByClassName('map-bar video-list')[0];
            list['style'].display = 'none';

            const prev = document.getElementsByClassName('carousel-control-prev')[0];
            prev['style'].display = 'none';
            const next = document.getElementsByClassName('carousel-control-next')[0];
            next['style'].display = 'none';
        };

        this.client.Events.OnVillageClicked = async (village: CesiumDataController.Village) => {
            if (!village) { return; }

            const status = document.getElementsByClassName('map-bar status')[0];
            status['style'].display = '';

            const list = document.getElementsByClassName('map-bar video-list')[0];
            list['style'].display = 'none';

            const prev = document.getElementsByClassName('carousel-control-prev')[0];
            prev['style'].display = 'none';
            const next = document.getElementsByClassName('carousel-control-next')[0];
            next['style'].display = 'none';


            let params: GetDivisionsParams | GetGarbageStationsParams;
            let response: Response<PagedList<Division | GarbageStation>>;

            params = new GetDivisionsParams();
            params.ParentId = village.id;
            response = await this.divisionService.list(params).toPromise();
            if (response.Data.Page.TotalRecordCount > 0) {
                this.amapService.childrenOfList = (response as Response<PagedList<Division>>).Data.Data.map(x => {
                    const item = new MapListItem(x.Id, x.Name, MapListItemType.Division, x);
                    return item;
                });

            } else {
                params = new GetGarbageStationsParams();
                params.DivisionId = village.id;
                response = await this.garbageService.list(params).toPromise();
                this.amapService.childrenOfList = (response as Response<PagedList<GarbageStation>>).Data.Data.map(x => {
                    return new MapListItem(x.Id, x.Name, MapListItemType.GarbageStation, x);
                });

                const parent = new MapListItem(village.parentId, '上一级', MapListItemType.Parent, null);
                this.amapService.childrenOfList.unshift(parent);
            }
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
        this.videoWindow.changePlayMode(PlayModeEnum.live, true);
        const element = document.getElementById('videoPlayer');
        element.style.display = 'none';

    }

    async OnCameraClicked(camera: Camera) {
        if (!camera) { return; }
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
            params.StreamType = this.videoWindow.stream;
            const response = await this.srService.PreviewUrls(params).toPromise();

            this.amapService.videoPlayerService.playCameraName = camera.Name;
            this.amapService.videoPlayerService.playMode = PlayModeEnum.live;
            this.amapService.videoPlayerService.playVideoVideoId = 'player';
            response.Data.Url = response.Data.Url.indexOf('password') > 0
                ? response.Data.Url : response.Data.Url + this.user.videoUserPwd;
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
        this.videoWindow.date = begin.format('yyyy-MM-dd');
        this.videoWindow.setBeginTime(begin);
        this.videoWindow.setEndTime(end);
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
                response.Data.Url = response.Data.Url.indexOf('password') > 0
                    ? response.Data.Url : response.Data.Url + this.user.videoUserPwd;
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
            response.Data.Url = response.Data.Url.indexOf('password') > 0
                ? response.Data.Url : response.Data.Url + this.user.videoUserPwd;
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

    OnPanelItemClicked(item: MapListItem<Division | GarbageStation>) {

        if (!item) { return; }
        let position: CesiumDataController.Position;

        switch (item.type) {
            case MapListItemType.Parent:
            case MapListItemType.Division:
                const village = this.dataController.Village.Get(item.Id);
                this.client.Village.Select(village.id, this.baseDivisionId === village.id);
                position = village.center;
                break;
            case MapListItemType.GarbageStation:
                try {
                    const point = this.dataController.Village.Point.Get((item.Data as GarbageStation).DivisionId, item.Id);
                    position = point.position;
                } catch (ex) {

                }
                break;
            default:
                return;
        }
        if (position) {
            this.client.Viewer.MoveTo(position);
        }
        if (this.mapPanelListItemClickedEvent) {
            this.mapPanelListItemClickedEvent.emit(item);
        }
    }

    OnPanelItemDoubleClicked(item: MapListItem<Division | GarbageStation>) {
        if (!item) { return; }

        switch (item.type) {
            case MapListItemType.GarbageStation:
                const data = item.Data as GarbageStation;
                const point = this.dataController.Village.Point.Get(data.DivisionId, data.Id);
                this.client.Events.OnElementsDoubleClicked([point]);
                break;
            default:
                break;
        }
    }



    VisibilityChange() { }

    OnPanelVisibilityChanged(visibility: boolean) {

    }

    MapReload() {
        if (this.baseDivisionId) {
            this.client.Village.Reload(this.baseDivisionId);
            this.client.Village.Select(this.baseDivisionId, true);
            this.refresh();
        }
    }

    Button1Clicked() {
        if (this.patrolButtonClicked) {
            this.patrolButtonClicked.emit();
        }
    }
    Button2Clicked() {
        if (this.vsButtonClicked) {
            this.vsButtonClicked.emit();
        }
    }

    Button3Clicked() {

        this.LabelVisibility = !this.LabelVisibility;
    }


    VillageSelect(villageId: string, move: boolean) {
        this.client.Village.Select(villageId, this.baseDivisionId === villageId);
        if (move) {
            const village = this.dataController.Village.Get(villageId);
            this.client.Viewer.MoveTo(village.center);
        }
    }


    async onVideoWindowDownload(args: { begin: Date, end: Date }) {
        if (!this.currentCamera) { return; }
        const interval = args.end.getTime() - args.begin.getTime();

        if ((interval) > 5 * 1000) {
            args.end.setTime(args.begin.getTime() + 5 * 1000 * 60);
        }


        const response = this.garbageService.cameraFileUrl(this.currentCamera.GarbageStationId, this.currentCamera.Id, args.begin.toISOString(), args.end.toISOString()).toPromise();
        response.then((data) => {
            if (data && data.Data && data.Data.Url) {
                const a = document.createElement('a');
                a.href = data.Data.Url;
                a.click();
                document.body.appendChild(a);
                document.body.removeChild(a);
            }
        });
    }

}

