/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[card-host]',
})
export class CardDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}

  clear(){
    this.viewContainerRef.clear()
  }
}
