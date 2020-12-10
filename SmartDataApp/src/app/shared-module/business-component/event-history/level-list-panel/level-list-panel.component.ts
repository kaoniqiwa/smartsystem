import { Component, Input, OnInit } from '@angular/core';
import { LevelListPanel, ListNode } from "./level-list-panel";
import { domClickFn } from '../../../../common/tool/jquery-help/jquery-help'; 
@Component({
  selector: 'hw-level-list-panel',
  templateUrl: './level-list-panel.component.html',
  styleUrls: ['./level-list-panel.component.styl']
})
export class LevelListPanelComponent implements OnInit {

  @Input() model: LevelListPanel;
  @Input() selectedFn:(id:string)=>void; 
  private showBody = false;
  private nodes = new Array<ListNode>();
  private prevItem = false;
  private selectedItem = ''
  constructor() { }

  ngOnInit() {
    if (this.model && this.model.listNodes) {
      const n=new ListNode();
      n.id='';
      n.name='请选择';
      n.parentId='';
      this.nodes = [n,this.model.listNodes[0]];
      this.selectedItem=n.name;
      if(this.selectedFn)this.selectedFn('');
    }
    domClickFn('body',()=>{
      this.showBody = false;
    }) ;
  }

  itemClick(val: ListNode) {
      this.selectedItem=val.name;
      if(this.selectedFn)this.selectedFn(val.id);
      const filter = this.model.listNodes.filter(x => x.parentId == val.id);
      if (filter.length) {
        this.nodes = filter;
        this.prevItem = true;
      }   
  }

  defaultItem(id:string){
    const node = this.model.listNodes.find(x=>x.id==id);
    this.itemClick(node);
  }

  prevItemClick() {
    var filter = this.model.listNodes.filter(x => x.id == this.nodes[0].parentId);
    if (filter.length) {
      const rootFind = filter.find(x=>x.parentId == null);
      if(rootFind){
        this.prevItem = false;
        const n=new ListNode();
        n.id='';
        n.name='全部';
        n.parentId=''; 
        filter.push(n);
        filter=filter.reverse();
      } 
      this.nodes = filter;      

    }
  }



}
