/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */
import { Injectable } from "@angular/core";
import { IBusinessConfig } from "../../../../shared-module/card-component/business-card-factory";
import { ConverterFactory } from "./business-view-converter";
import { StatisticBusinessInjector } from "../injector/statistic-business-injector";
import { BusinessViewComponet } from "../../../../common/tool/business-view-component";
import { CardDirective } from "../../../../common/directive/card-directive";
import { BaseView, IViewModel } from "../../../../common/abstract/base-view";
import { BusinessViewComponetConstructor } from "../business-card-slot.service";

import { CardContentFactory } from "../../../../shared-module/card-component/card-content-factory";
import { CardComponent } from "../../../../shared-module/card-component/card.component";

@Injectable()
export class BusinessViewComponetFactory {
    constructor(private converterFactory: ConverterFactory
        , private cardContentFactory: CardContentFactory
        , private statisticBusinessInjector: StatisticBusinessInjector) { }
    create(businessConfig: IBusinessConfig, cardHost: CardDirective): BusinessViewComponetConstructor;
    create(businessConfig: IBusinessConfig[], cardHost: CardDirective): BusinessViewComponetConstructor;
    create(businessConfig: IBusinessConfig | IBusinessConfig[], cardHost: CardDirective) {

        let constructor = new BusinessViewComponetConstructor();
        let card = this.cardContentFactory.create<CardComponent>(cardHost, CardComponent);

        const create_ = (businessConfig: IBusinessConfig) => {
            card.instance.border = businessConfig.border == null;          
            let converter = this.converterFactory.createConvert(businessConfig);
            let business = this.statisticBusinessInjector.createBusiness(businessConfig);
            if (business && business.timeSpan) {
                business.timeSpan.interval = businessConfig.dataTime;
                business.timeSpan.nextRefreshTime.setSeconds(business.timeSpan.nextRefreshTime.getSeconds() + business.timeSpan.interval);
            }
            let content = this.cardContentFactory.create<BaseView<IViewModel>>(card.instance.cardHost, businessConfig.cardType);
            let view = content.instance as BaseView<IViewModel>;
            // if (businessConfig.defaultViewMoel){                 
            //     view.defaultViewData=businessConfig.defaultViewMoel;
            // }
            if (view.timeSpan) {
                view.timeSpan.interval = businessConfig.flipTime;
            }

            if (!business || !converter) return null;
            return new BusinessViewComponet(converter, business, view);
        }
        if (Array.isArray(businessConfig))
            businessConfig.map(x => {
                let i = create_(x);
                if (i)
                    constructor.list.push(i);
            });

        else constructor.list.push(create_(businessConfig));
        return constructor;
    }
}
