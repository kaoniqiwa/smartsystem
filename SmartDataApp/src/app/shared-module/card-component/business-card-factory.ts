/**
 * Developer 施文斌
 * LastUpdateTime
 */
import { Injectable, ComponentRef, Component } from "@angular/core";
import { CardContentFactory } from "./card-content-factory";
import { CardDirective } from "../../common/directive/card-directive";
import { IBusinessData } from "../../common/interface/IBusiness";
import { IViewModel } from "../../common/abstract/base-view";
import { DivisionType, EventType } from "src/app/data-core/model/enum";
@Injectable({
  providedIn: "root",
})
export class BusinessCardFactory {
  constructor(public cardContentFactory: CardContentFactory) {}

  create(cardHost: CardDirective, cardConfig: IBusinessConfig) {
    let contentComponent: ComponentRef<Component> =
      this.cardContentFactory.create(cardHost, cardConfig.cardType);
    return contentComponent;
  }
}

export interface IBusinessConfig {
  business: string;
  cardType: string;
  dataTime?: number;
  flipTime?: number;
  divisionId?: string;
  border?: boolean;
  state?: boolean;
  stationId?: string;
  eventType?: EventType;
  divisionType?: DivisionType;
  // defaultViewMoel:IViewModel;
}
