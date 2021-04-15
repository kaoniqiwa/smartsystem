import { Component, Input, OnInit} from '@angular/core';
import { SelectOption } from "./select-option";
import { domClickFn } from '../../common/tool/jquery-help/jquery-help';
import { ComponentService } from "../component-service";
@Component({
  selector: 'hw-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.styl']
})
export class SelectOptionComponent implements OnInit {

  @Input() model: SelectOption;
  @Input() selectedItemFn: (id: string) => void;
  selectedItemLabel = '';
  private showBody = false;
  constructor(private componentService:ComponentService) { }

  ngOnInit() {
    domClickFn('body', () => {
      this.showBody = false;
    }); 
    if(this.model&&this.model.defaultId)this.defaultItem(this.model.defaultId);
 

    this.componentService.selectOptionEventEmitter.subscribe((items:Array<{id:string,name:string}>)=>{ 
      setTimeout(() => {
        if(items){
          const index = this.model.listNodes.findIndex(f=>f.name == items[0].name);
          /**更新 数据列表 */
          if(index >-1){
            this.model.listNodes = items;
            this.selectedItemLabel = items[0].name;
            this.showBody=false;
          } 
        } 
      });
    
    });
  } 

  itemClick(val: {
    id: string;
    name: string;
  }) {
    this.selectedItemLabel = val.name;
    if (this.selectedItemFn) this.selectedItemFn(val.id);
    this.showBody=false;
  }

  defaultItem(id:string){
    const node = this.model.listNodes.find(x=>x.id==id);
    this.itemClick(node);
  }

}
