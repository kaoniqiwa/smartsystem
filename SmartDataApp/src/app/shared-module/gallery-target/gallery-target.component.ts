import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { domSize, drawRectangle, clearCanvas } from '../../common/tool/jquery-help/jquery-help';
import { GalleryTarget, ImageEventEnum } from "./gallery-target";
@Component({
  selector: 'hw-gallery-target',
  templateUrl: './gallery-target.component.html',
  styleUrls: ['./gallery-target.component.styl']
})
export class GalleryTargetComponent implements OnInit, OnChanges {

  @Input() model: GalleryTarget;


  @Input() closeViewFn: () => void;

  @Input() imgEventFn: (e: ImageEventEnum, id: string) => number;

  @Input() videoFn:(id:string)=>void;

  onDescFn = (on: boolean) => {
    this.onDesc = on;
  }

  imgEvent = ImageEventEnum;
  constructor() { }

  closeViewClick() {
    if (this.closeViewFn) this.closeViewFn();
  }

  enlargeImageSize = {
    width: 0,
    height: 0
  }

  onDesc = false;
  ngOnChanges() {

    this.load();
  }

  imgPageClick(e: ImageEventEnum) {

    if (this.imgEventFn) this.imgEventFn(e, this.model.id);
  }

  ngOnInit() {

    window.addEventListener("resize", () => this.load());
  }

  videoClick(){
    if(this.videoFn)this.videoFn(this.model.id);
  }

  load() {
    if (this.model) {
      setTimeout(() => {
        const size = domSize('enlargeImage');
        this.enlargeImageSize.width = size.width;
        this.enlargeImageSize.height = size.height;   
        setTimeout(() => {
          clearCanvas('polygonCanvas');
         
          drawRectangle('polygonCanvas',this.model.polygon, size);
        });
      });
    }
  }
}
