/**
 * Developer 施文斌
 * LastUpdateTime 
 */
import { ComponentFactoryResolver, Injectable, Type, ComponentRef } from '@angular/core';
import { CardDirective } from '../../common/directive/card-directive';
import { LineEChartsCardComponent } from './line-echarts-card/line-echarts-card.component'; 
import { StateScaleCardComponent } from './state-scale-card/state-scale-card.component'; 
import {HeaderSquareListComponent  } from "../header-square-list/header-square-list.component";
import { ImageThemeCardComponent } from "./image-theme-card/image-theme-card.component";
import { HintCardComponent } from "./hint-card/hint-card.component";
import { OrderTableCardComponent } from "./order-table-card/order-table-card.component";
import { CardComponent } from './card.component'; 
import { isString } from 'util'; 

@Injectable(
    {
        providedIn: 'root'
    }
)
export class CardContentFactory {
    constructor(public componentFactoryResolver: ComponentFactoryResolver) {

    }

    creates(cardDirective: CardDirective, componentTypes: string[]) {
        let components = new Array();
        for (var x of componentTypes) {
            const component = this.create(cardDirective,x);
            components.push(component);
        }
        return components;
    }

   
   create<T>(cardContentDirective: CardDirective, cardType:string):ComponentRef<T>;
   create<T>(cardComponent: CardDirective, cardType:Type<T>):ComponentRef<T>;
    create(cardContentDirective:CardDirective, cardType:string| any) {//card 组件     
        if(isString(cardType)){            
            let componentFactory1= this.componentFactoryResolver.resolveComponentFactory(CardComponentEnum[cardType] as any);
            const component = cardContentDirective.viewContainerRef.createComponent(componentFactory1);
            return component;
        }
          if (cardType instanceof Type){ 
            let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CardComponent);
            const component = cardContentDirective.viewContainerRef.createComponent(componentFactory);
            return component;
        } 
      
    } 
}

export const CardComponentEnum = {
    "LineEChartsCardComponent": LineEChartsCardComponent,        
    "StateScaleCardComponent": StateScaleCardComponent,
    "HeaderSquareListComponent":HeaderSquareListComponent,
    "ImageThemeCardComponent":ImageThemeCardComponent,
    "HintCardComponent":HintCardComponent,
    "OrderTableCardComponent":OrderTableCardComponent
  }