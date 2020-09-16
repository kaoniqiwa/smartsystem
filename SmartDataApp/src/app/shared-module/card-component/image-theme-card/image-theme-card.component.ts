import { Component, Input, OnInit } from '@angular/core';
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import {ImageTheme  } from "./image-theme";
@Component({
  selector: 'app-image-theme-card',
  templateUrl: './image-theme-card.component.html'
})
export class ImageThemeCardComponent extends BasisCardComponent implements OnInit {

  @Input() model:ImageTheme;
  constructor() {
    super();
   }

  ngOnInit() {
    this.loadDatas(new ViewsModel());
  }

}
