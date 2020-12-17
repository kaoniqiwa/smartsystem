import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GalleryRollPage } from "./gallery-roll-page";
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import { pageCount } from "../../../common/tool/tool.service";
import { ResourceSRServersRequestService } from "../../../data-core/repuest/resources.service";
import { GetPreviewUrlParams } from "../../../data-core/model/aiop/video-url";
import { HWSPlayerDirective, HWSPlayerOptions } from "../../../common/directive/wsplayer-directive";
import { moveView2, domSize } from "../../../common/tool/jquery-help/jquery-help";
import { MessageBar } from "../../../common/tool/message-bar";
@Component({
  selector: 'hw-gallery-roll-page',
  templateUrl: './gallery-roll-page.component.html',
  styleUrls: ['./gallery-roll-page.component.styl']
})
export class GalleryRollPageComponent extends BasisCardComponent implements OnInit {

  @Input() model: GalleryRollPage;

  @ViewChild(HWSPlayerDirective)
  player: HWSPlayerDirective;
  playing = false;
  currentPlayId = '';
  playViewSize = {
    width: 100,
    height: 100
  }
  autoChangePage = true;
  constructor(private srRequestService: ResourceSRServersRequestService) {
    super();
  }


  ngOnInit() {
    this.loadDatas(new ViewsModel());

    window.setInterval(() => {
      if (this.model && this.autoChangePage) {
        this.model.index += 1;
        if (this.model.index > this.model.items.size)
          this.model.index = 1;
      }
      this.tagClick(null,false);
    }, 60 * 1000)

    window.setInterval(() => {
      if (this.playing && this.currentPlayId) {
        const val = this.model.items.get(this.model.index)
          , id = val.imgDesc.find(x => x.tag.id == this.currentPlayId);


        if (id == null) {
          this.playing = false;
          this.currentPlayId = '';
        }
      }
    }, 10)
  }

  playState(cameraId: string) {
    return this.playing && cameraId == this.currentPlayId;
  }

  async playVideo(cameraId: string) {
    this.playViewSize = domSize('item__' + cameraId);

    moveView2('item__' + cameraId, 'video__view_wrap', 0, 0);
    const params = new GetPreviewUrlParams();
    params.CameraId = cameraId;
    params.Protocol = 'ws-ps';
    params.StreamType = 1;
    const response = await this.srRequestService.PreviewUrls(params).toPromise();

    setTimeout(() => {
      this.playing = true;
      this.currentPlayId = cameraId;
      const videoOptions = new HWSPlayerOptions(response.Data.Url, '');
      this.player.playVideo(videoOptions);
    });

  }

  get items() {
    return this.model.items.get(this.model.index);

  }

  get imgs() {
    const val = this.model.items.get(this.model.index);

    if (val && val.imgDesc)
      return val.imgDesc.slice(val.index * 3, val.index * 3 + 4);
    return new Array();
  }

  get title() {
    const val = this.model.items.get(this.model.index);
    if (val)
      return val.title.text;
    else return '';
  }

  get titleColor() {
    const val = this.model.items.get(this.model.index);
    if (val)
      return val.title.color;
    else return '';
  }

  get imgsPage() {
    const val = this.model.items.get(this.model.index), num = new Array();

    if (val) {
      const p = pageCount(val.imgDesc.length, 4);
      for (let i = 0; i < parseInt(p + ''); i++)
        num.push(1);
    }
    return num;
  }

  get currentImgPageNum() {
    const val = this.model.items.get(this.model.index);
    if (val) return val.index;
    else return 0;
  }

  prevImgPage() {
    const val = this.model.items.get(this.model.index);
    val.index -= 1;
    this.playing = false;
    this.currentPlayId = '';
  }

  nextImgPage() {
    const val = this.model.items.get(this.model.index);
    val.index += 1;
    this.playing = false;
    this.currentPlayId = '';

  }

  get minImgPage() {
    const val = this.model.items.get(this.model.index);
    if (val == null || val.imgDesc == null) return false;
    var max = pageCount(val.imgDesc.length, 4);

    return val.index <= parseInt(max + '') && val.index > 0;

  }

  get maxImgPage() {
    const val = this.model.items.get(this.model.index);
    if (val == null || val.imgDesc == null) return false;
    var max = pageCount(val.imgDesc.length, 4);
    return val.index < parseInt(max + '') - 1;

  }

  nextImgGroup() {
    this.model.index += 1;
    if (this.model.index > this.model.items.size)
      this.model.index = this.model.items.size;
  }

  prevImgGroup() {
    this.model.index -= 1;
    if (this.model.index <= 0)
      this.model.index = 1;
  }

  tagClick(param: string,msg:boolean) {
    if (param) {
      this.btnControl(null);
    }
    else {
      const val = this.model.items.get(this.model.index);
      if (this.btnControl && this.model) {
        this.btnControl({
           g:val,
           msg:msg
        });
      }
    }

  }
}
