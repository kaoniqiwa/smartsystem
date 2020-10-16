import { Component, Input, OnInit } from '@angular/core';
import { domSize, drawRectangle } from '../../../../common/tool/jquery-help/jquery-help';
import { GalleryTarget } from "./gallery-target";
@Component({
  selector: 'hw-gallery-target',
  templateUrl: './gallery-target.component.html',
  styleUrls: ['./gallery-target.component.styl']
})
export class GalleryTargetComponent implements OnInit {

  @Input() model: GalleryTarget;

  @Input() closeViewFn: () => void;

  onDescFn = (on:boolean)=>{
    this.onDesc=on;
  }
  constructor() { }

  closeViewClick() {
    if (this.closeViewFn) this.closeViewFn();
  }

  enlargeImageSize = {
    width: 0,
    height: 0
  }

  onDesc = false;
  ngOnInit() {
    const load = ()=>{
      if (this.model) {
        setTimeout(() => {
          const size = domSize('enlargeImage');
          this.enlargeImageSize.width=size.width;
          this.enlargeImageSize.height=size.height;
          const point1 = {
            x: this.model.polygon[0].X * size.width,
            y: this.model.polygon[0].Y * size.height,
          }, point2 = {
            x: this.model.polygon[1].X * size.width,
            y: this.model.polygon[1].Y * size.height,
          }, point3 = {
            x: this.model.polygon[2].X * size.width,
            y: this.model.polygon[2].Y * size.height,
          }, point4 = {
            x: this.model.polygon[3].X * size.width,
            y: this.model.polygon[3].Y * size.height,
          }
          setTimeout(() => {
            drawRectangle('polygonCanvas', point1, point2, point3, point4);
          });
        });
      }
    }
    load();

    window.addEventListener("resize", () =>  load());
  }
}
