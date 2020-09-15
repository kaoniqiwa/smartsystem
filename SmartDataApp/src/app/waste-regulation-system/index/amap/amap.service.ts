import { Injectable } from '@angular/core';

@Injectable()
export class AMapService {

    src: string;


    constructor() {
        const host = document.location.hostname;
        const port = 8890;
        this.src = 'http://' + host + ':' + port + '/amap/map_ts.html?maptype=AMapOffline&v=20191106';
    }
}
