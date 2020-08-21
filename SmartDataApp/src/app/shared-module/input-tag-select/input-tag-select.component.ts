import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { InputSearchComponent } from "../input-search/input-search.component";
import { InputTagSelect } from "./input-tag-select";
import '../../common/tool/jquery-help/jquery-help';
import { domClickFn } from '../../common/tool/jquery-help/jquery-help'; 
@Component({
  selector: 'hw-input-tag-select',
  templateUrl: './input-tag-select.component.html',
  styleUrls: ['./input-tag-select.component.styl']
})
export class InputTagSelectComponent implements OnInit {
  @Input() model = new Array<InputTagSelect>();
  @ViewChild('search')
  search: InputSearchComponent;
  filterHide = (text: string) => {
    this.model.map(x => x.hide = true);
    this.model.filter((x) => {
      return x.text.indexOf(text) > -1;
    }).map(x => x.hide = false);
  }
  showBody = false;
  constructor() { }

  ngOnInit() {
    domClickFn('body',()=>{
      this.showBody = false;
    }) ;
  }

  get filterChecked() {
    return this.model.filter((x) => {
      return x.checked == true && x.hide == false;
    });
  }

  get allChecked() {
    return this.model.filter((x) => {
      return x.hide == false;
    });
  }

  get noneChecked() {
    return this.model.filter((x) => {
      return x.checked == true;
    }).length == 0 || this.model.length == 0;
  }

  get noneData() {
    return this.model.filter((x) => {
      return x.hide == false;
    }).length == 0 || this.model.length == 0;
  }

  setChecked(val: InputTagSelect) {
    val.checked = !val.checked;
     this.showBody = true;
  }

  closeChecked(val: InputTagSelect) {
    val.checked = false;
  } 


}
