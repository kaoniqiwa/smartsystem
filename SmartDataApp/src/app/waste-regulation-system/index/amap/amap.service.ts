import { Injectable } from '@angular/core';
import { VideoPlayerService } from './video-player.service';

@Injectable()
export class AMapService {

    constructor(
        public videoPlayerService: VideoPlayerService) {

    }
}
