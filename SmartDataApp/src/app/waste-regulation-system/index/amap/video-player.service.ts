import { Injectable } from '@angular/core';
import { VideoPlayArgs } from 'src/app/video-window/mode';
import { PlayModeEnum } from 'src/app/video-window/video-window.component';

@Injectable({
    providedIn: 'root'
})
export class VideoPlayerService {

    videoPlayArgs?: VideoPlayArgs;
    url = '';
    playMode = PlayModeEnum.live;
    playVideoVideoId = '';
    playCameraName = '';
    constructor() {
        this.playCameraName = '视频';
    }
}
