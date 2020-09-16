/**
 * Developer  
 * LastUpdateTime  
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CardDirective } from '../../common/directive/card-directive';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  @ViewChild(CardDirective) cardHost: CardDirective;
  border = true;
  ngOnInit() {

  } 

  clearView(){
    this.cardHost.viewContainerRef.clear();
  }
}