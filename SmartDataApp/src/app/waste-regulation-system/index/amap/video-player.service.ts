import { Injectable } from '@angular/core';
import { VideoPlayArgs } from '../../../video/mode';
import { PlayModeEnum } from '../../../video-window/video-window.component';

@Injectable({
    providedIn: 'root'
})
export class VideoPlayerService {

    videoPlayArgs?: VideoPlayArgs;
    url = '';
    webUrl = '';
    playMode = PlayModeEnum.live;
    playVideoVideoId = '';
    playCameraName = '';

    constructor() {
        this.playCameraName = '视频';
    }
}
