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
  @Input() closeTag= false; 
  private eleId: string = 'video' + new Guid('').NewGuid().ToString('N');
  playerOptions:HWSPlayerOptions;
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

  closeTagClick(){   
   this.model.title='';
   if(this.btnControl)this.btnControl(null);
  } 

  play() {
    if (this.model) { 
    
      let url = `rtmp://${this.model.host}/stream?dev_id=${this.model.deviceId}&slot=${this.model.slot}
      &stream=1&mode=${this.model.mode}&user=${this.model.userName}&password=${this.model.password}`;
      if (this.model.mode == "playback") {
        url += `&beg=${this.model.beginTime}&end=${this.model.endTime}`;
      }
      this.playerOptions = new HWSPlayerOptions(url,'');
    }
 
  } 
}
