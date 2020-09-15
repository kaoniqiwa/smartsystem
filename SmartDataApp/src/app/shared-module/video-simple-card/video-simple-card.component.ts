/**
 * Developer 施文斌
 * LastUpdateTime 
 */
import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { Guid } from '../../common/tool/guid';
import { VideoCardComponent, ViewsModel } from '../../common/abstract/base-view';
import { VideoSimpleMode } from './video-simple';
import { HWSPlayerOptions } from '../../common/directive/wsplayer-directive';
@Component({
  selector: 'app-video-simple-card',
  templateUrl: './video-simple-card.component.html',
  styleUrls: ['./video-simple-card.component.css'],
  providers: []
})
export class VideoSimpleCardComponent extends VideoCardComponent implements OnInit, AfterContentInit {
  @Input() model: VideoSimpleMode;
  @Input() closeTag = false;
  private eleId: string = 'video' + new Guid('').NewGuid().ToString('N');
  playerOptions: HWSPlayerOptions;
  constructor() {
    super();
  }


  ngAfterContentInit() {
    if (this.loadDatas) {
      this.loadDatas(new ViewsModel());
    }
  }

  ngOnInit() {
    this.playVideo = () => {
      this.play();
    };
  }

  closeTagClick() {
    this.model.title = '';
    if (this.btnControl) { this.btnControl(null); }
  }

  play() {
    if (this.model) {

      // tslint:disable-next-line:max-line-length
      let url = `ws://${this.model.host}:${this.model.port}/ws/video/howellps/${this.model.mode}/${this.model.deviceId}/${this.model.slot}/1/${this.model.mode}.mp4?user=${this.model.userName}&password=${this.model.password}"`;

      if (this.model.mode == "playback") {
        // tslint:disable-next-line:max-line-length
        url = `ws://${this.model.host}:${this.model.port}/ws/video/howellps/${this.model.mode}/${this.model.deviceId}/${this.model.slot}/1/${this.model.beginTime}_${this.model.endTime}/${this.model.mode}.mp4?user=${this.model.userName}&password=${this.model.password}"`;
      }
      this.playerOptions = new HWSPlayerOptions(url, '');
    }

  }
}
