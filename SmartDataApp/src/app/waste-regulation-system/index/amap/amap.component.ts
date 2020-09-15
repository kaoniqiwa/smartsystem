import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera } from '../../../data-core/model/waste-regulation/camera';
import { GarbageStation, GetGarbageStationsParams } from '../../../data-core/model/waste-regulation/garbage-station';
import { CameraRequestService, GarbageStationRequestService } from '../../../data-core/repuest/garbage-station.service';
import { AMapService } from './amap.service';


@Component({
    selector: 'app-amap',
    templateUrl: './amap.component.html',
    styleUrls: ['./amap.component.css'],
    providers: [AMapService]
})
export class AMapComponent implements AfterViewInit, OnInit {

    selectedCameras: Camera[] = [];
    garbages: GarbageStation[];
    // amapSrc: any;
    srcUrl: any;
    dataController: CesiumDataController.Controller; // CesiumDataController.Controller;
    client: CesiumMapClient;

    constructor(
        private sanitizer: DomSanitizer,
        private garbageService: GarbageStationRequestService,
        private cameraService: CameraRequestService
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
    }
    OnCameraClicked(camera: Camera) {
        console.log(camera);
    }
    ngAfterViewInit() {
        // Detect effects of NgForTrackBy
        this.client = new CesiumMapClient('iframe');
        this.client.Events.OnLoading = () => {
            // for (var i = 0; i < 100; i++) {
            //     AddAlarm(i * 10);
            // }

            console.log('client.Events.OnLoading');
            this.dataController = this.client.DataController;
        };
        this.client.Events.OnLoaded = () => {


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

        this.client.Events.OnElementsDoubleClicked = (objs) => {
            if (!objs || objs.length <= 0) { return; }
            const id = objs[0].id;
            const list = document.getElementsByClassName('map-bar video-list')[0];
            if (list && objs && objs.length > 0) {
                list['style'].display = 'block';
                const promise = this.cameraService.list(id).toPromise();
                promise.then((response) => {
                    console.log(response.Data);
                    this.selectedCameras = response.Data;
                });
            }

        };
        this.client.Events.OnElementsClicked = function (objs) {
            if (!objs || objs.length === 0) {
                const list = document.getElementsByClassName('map-bar video-list')[0];
                list['style'].display = 'none';
            }
        };
    }

}

