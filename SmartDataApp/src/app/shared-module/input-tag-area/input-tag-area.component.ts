import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { InputTagArea } from "./input-tag-area";
import { InputSearchComponent } from "../input-search/input-search.component";
@Component({
  selector: 'hw-input-tag-area',
  templateUrl: './input-tag-area.component.html',
  styleUrls: ['./input-tag-area.component.styl']
})
export class InputTagAreaComponent implements OnInit {

  @Input() model = new Array<InputTagArea>();
  @Input() addTagFn: (item: InputTagArea, forId: (id: string) => void) => void;
  @Input() delTagFn: (item: InputTagArea, fn: (success: boolean) => void) => void;
  @ViewChild('search')
  search: InputSearchComponent;
  filter1Hide = (text: string) => {
    this.model.map(x => x.hide = true);
    this.model.filter((x) => {
      return x.text.indexOf(text) > -1 && x.type == 1;
    }).map(x => x.hide = false);


  }
  filter2Hide = (text: string) => {
    this.model.map(x => x.hide = true);
    this.model.filter((x) => {
      return x.text.indexOf(text) > -1 && x.type == 2;
    }).map(x => x.hide = false);
  }
  constructor() { }

  ngOnInit() {
  }

  addTagClick() {
    const text = this.search.searchInput.value;
    if (text && this.addTagFn) {
      var item = new InputTagArea('', text, false, 1);
      this.addTagFn(item, (id: string) => {
        item.id = id;
        item.type = 1;
      });
      this.model.push(item);
      this.search.searchInput.setValue('');
    }
  }

  delFilter1Click(item: InputTagArea) {
    if (this.delTagFn) this.delTagFn(item, (success: boolean) => {
      item.del = success;
    });
  }

  get filter1Checked() {
    return this.model.filter((x) => {
      return x.type == 1 && x.hide == false && x.del ==false;
    });
  }

  get filter2Checked() {
    return this.model.filter((x) => {
      return x.type == 2 && x.hide == false && x.del ==false;
    });
  }


  // set toChecked(val: InputTagArea) {
  //   val.checked = !val.checked;
  //   if(this.outPutTag)this.outPutTag(val);
  // }


}
