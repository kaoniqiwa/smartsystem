import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraRequestService as AIOPCameraService, ResourceMediumRequestService } from '../../../data-core/repuest/resources.service';
import { VideoSimpleCardComponent } from '../../../shared-module/video-simple-card/video-simple-card.component';

import { GarbageStation, GetGarbageStationsParams } from '../../../data-core/model/waste-regulation/garbage-station';

import {
    CameraRequestService as GarbageStationCameraRequestService, GarbageStationRequestService
} from '../../../data-core/repuest/garbage-station.service';
import { AMapService } from './amap.service';
import { Camera } from 'src/app/data-core/model/aiop/camera';
import { VideoSimpleMode } from 'src/app/shared-module/video-simple-card/video-simple';
import { Id } from 'src/app/common/tool/idProcessing';

@Component({
    selector: 'app-amap',
    templateUrl: './amap.component.html',
    styleUrls: ['./amap.component.css'],
    providers: [AMapService]
})
export class AMapComponent implements AfterViewInit, OnInit {
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('preview') videoCard: VideoSimpleCardComponent;
    selectedCameras: Camera[];
    garbages: GarbageStation[];
    srcUrl: any;
    dataController: CesiumDataController.Controller; // CesiumDataController.Controller;
    client: CesiumMapClient;

    constructor(
        private sanitizer: DomSanitizer,
        private changeDetectorRef: ChangeDetectorRef,
        private garbageService: GarbageStationRequestService,
        private aiopCameraService: AIOPCameraService,
        private mediaService: ResourceMediumRequestService,
        private cameraService: GarbageStationCameraRequestService
    ) {
        this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());

    }

    getSrc() {
        const host = document.location.hostname;
        const port = document.location.port;
        return 'http://' + host + ':' + port + '/amap/map_ts.html?maptype=AMapOffline&v=20191106';
    }

    ngOnInit() {
        const promise = this.garbageService.list(new GetGarbageStationsParams()).toPromise();
        promise.then((response) => {
            this.garbages = response.Data.Data;
        });

        // Detect effects of NgForTrackBy
        this.client = new CesiumMapClient(this.iframe.nativeElement);
        this.client.Events.OnLoading = () => {
            this.dataController = this.client.DataController;
        };
        this.client.Events.OnLoaded = () => {

            console.log('this.client.Events.OnLoaded');
            for (const id in this.garbages) {
                if (this.garbages[id].DryFull || this.garbages[id].WetFull) {
                    const status = {
                        id: id,
                        status: 1
                    };
                    console.log(status);
                    this.client.Point.Status(status);
                }
            }



            const villages = this.dataController.Village.Point.List();
            for (const villageId in villages) {
                if (Object.prototype.hasOwnProperty.call(villages, villageId)) {
                    const village = villages[villageId];

                }
            }
        };

        this.client.Events.OnElementsDoubleClicked = async (objs) => {
            if (!objs || objs.length <= 0) { return; }
            const id = objs[0].id;
            const list = document.getElementsByClassName('map-bar video-list')[0];
            if (list && objs && objs.length > 0) {
                list['style'].display = 'block';
                try {
                    const response = await this.cameraService.list(id).toPromise();

                    const p = response.Data.map(async x => {
                        const camera_response = await this.aiopCameraService.get(x.Id).toPromise();
                        return camera_response.Data;
                    });
                    this.selectedCameras = [];
                    for (let i = 0; i < response.Data.length; i++) {
                        try {
                            const camera_response = await this.aiopCameraService.get(response.Data[i].Id).toPromise();
                            if (camera_response) {
                                if (camera_response.Data.ImageUrl) {
                                    camera_response.Data.ImageUrl = this.mediaService.getData(camera_response.Data.ImageUrl);
                                } else {
                                    camera_response.Data.ImageUrl = 'assets/img/timg.jpg';
                                }

                                this.selectedCameras.push(camera_response.Data);
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

            }

        };
        this.client.Events.OnElementsClicked = function (objs) {
            if (!objs || objs.length === 0) {
                const list = document.getElementsByClassName('map-bar video-list')[0];
                list['style'].display = 'none';
            }
        };
    }
    ngAfterViewInit() {

    }

    OnCameraClicked(camera: Camera) {
        if (!camera || !camera.SRSId) { return; }
        console.log(camera);
        const id = new Id(camera.SRSId);
        const model = new VideoSimpleMode();
        model.host = document.location.hostname;
        model.port = parseInt(document.location.port);
        model.deviceId = camera.SRSId;
        model.mode = 'live';
        model.deviceId = id.getDeviceId();
        model.slot = id.ModuleId.No;
        model.userName = 

        this.videoCard.model.
        SRServers/PreviewUrls
        CameraId	String	监控点ID	M
StreamType	Int32	流类型：1-主码流，2-子码流	M
Protocol	String	协议类型：
rtmp, rtsp, hls, ws-flv, ws-ps	M


    }
}

