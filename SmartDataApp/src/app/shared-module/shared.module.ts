
import { NgModule } from '@angular/core'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {  MatTreeModule,MatSidenavModule,MatToolbarModule ,MatButtonModule,MatMenuModule,MatButtonToggleModule
  ,MatSnackBarModule,MatTabsModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormTitlePipe,TxtLenPipe } from "../common/tool/howell.pipe";
import { DateTimePickerDirective,DateTimePickerMirrorDirective } from "../common/directive/date-time-picker.directive";
import {  EChartBarDirective} from "../common/directive/echarts/bar-directive";
import {  EChartBarDirectiveV2} from "../common/directive/echarts/bar-directive-v2";
import {  EChartLineDirective} from "../common/directive/echarts/line-directive";
import {  EChartPieOutDirective} from "../common/directive/echarts/pie/pie-out-directive";
import {  EChartPieInDirective} from "../common/directive/echarts/pie/pie-in-directive";
import {  EChartPieMiddleDirective} from "../common/directive/echarts/pie/pie-middle-directive";
import {  EChartProgressBarBoxDirective} from "../common/directive/echarts/pie/progress-bar-box-directive";
import {  EChartProgressBarDirective} from "../common/directive/echarts/pie/progress-bar-directive";
import { HWSPlayerDirective } from "../common/directive/wsplayer-directive";
import { TouchSpinDirective } from "../common/directive/touch-spin-directive";
import { HWPaginationDirective } from "../common/directive/pagination-directive";
import {  CardDirective } from "../common/directive/card-directive";
import { InputSearchComponent } from './input-search/input-search.component'; 
import { InputTagAreaComponent } from './input-tag-area/input-tag-area.component';
import { CustomTableComponent } from "./custom-table/custom-table.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { InputTagSelectComponent } from './input-tag-select/input-tag-select.component';
import { CustomTreeComponent } from './custom-tree/custom-tree.component';
import { PicturesDropListComponent } from './pictures-drop-list/pictures-drop-list.component';
import { CardListPanelComponent } from './card-list-panel/card-list-panel.component'; 
import { VideoSimpleCardComponent } from './video-simple-card/video-simple-card.component';
import { StateScaleCardComponent } from './card-component/state-scale-card/state-scale-card.component';
import { CardComponent } from "./card-component/card.component";  
import { BusinessCardGridComponent } from '../waste-regulation-system/index/business-card-grid/business-card-grid.component';
import { HeaderSquareListComponent } from './header-square-list/header-square-list.component';
import { ImageThemeCardComponent } from './card-component/image-theme-card/image-theme-card.component';
import { HintCardComponent } from './card-component/hint-card/hint-card.component';
import { OrderTableCardComponent } from './card-component/order-table-card/order-table-card.component';
import { LineEChartsCardComponent } from "./card-component/line-echarts-card/line-echarts-card.component";
import { SwitchComponent } from './switch/switch.component';
import { TimeToolComponent } from "./time/time-tool.component";
import { GalleryTargetComponent } from "./gallery-target/gallery-target.component";
import { ImageDescCardComponent } from './image-desc-card/image-desc-card.component'; 
import { IllegalDropEventHistoryComponent } from "./business-component/event-history/illegal-drop-event-history/illegal-drop-event-history.component";
import { IllegalDropEventAnalyzeComponent } from "./business-component/event-history/illegal-drop-event-analyze/illegal-drop-event-analyze.component";
import { TreeDropListComponent } from "./business-component/event-history/illegal-drop-event-analyze/tree-drop-list/tree-drop-list.component";
import { IllegalDropEventChartComponent } from "./business-component/event-history/illegal-drop-event-chart/illegal-drop-event-chart.component";
import { IllegalDropEventCardListComponent } from "./business-component/event-history/illegal-drop-event-card-list/illegal-drop-event-card-list.component";
import { LevelListPanelComponent } from './business-component/event-history/level-list-panel/level-list-panel.component';
import { MixedIntoEventHistoryComponent } from './business-component/event-history/mixed-into-event-history/mixed-into-event-history.component';
import { FullGarbageStationComponent } from './business-component/full-garbage-station/full-garbage-station.component';
import { GarbageStationComponent } from './business-component/garbage-station/garbage-station.component';
import { GarbageStationCamerasComponent } from './business-component/garbage-station-cameras/garbage-station-cameras.component';
import { UserToolComponent } from "./business-component/user-tool/user-tool.component";
import { GalleryRollPageComponent } from './card-component/gallery-roll-page/gallery-roll-page.component';
import { IllegalDropEventSummaryComponent } from './business-component/event-history/illegal-drop-event-summary/illegal-drop-event-summary.component';
import { IllegalDropEventAnalyzeV2Component } from './business-component/event-history/illegal-drop-event-analyze-v2/illegal-drop-event-analyze-v2.component';
import { VsClassStatisticComponent } from './business-component/vs-class-statistic/vs-class-statistic.component';
import { TreeDropListV2Component } from './business-component/vs-class-statistic/tree-drop-list-v2/tree-drop-list-v2.component';

@NgModule({
  imports: [
    CommonModule,DragDropModule, HttpClientModule,ScrollingModule,
    FlexLayoutModule,MatTreeModule,
    ReactiveFormsModule ,MatSidenavModule,MatToolbarModule,MatTabsModule,
    MatButtonModule,MatMenuModule,MatButtonToggleModule,MatSnackBarModule
  ],
  declarations: [
    DateTimePickerDirective,DateTimePickerMirrorDirective,
    HWPaginationDirective,TouchSpinDirective,EChartBarDirective,EChartBarDirectiveV2,EChartLineDirective ,HWSPlayerDirective,CardDirective
    ,EChartPieOutDirective,EChartPieInDirective,EChartPieMiddleDirective ,EChartProgressBarBoxDirective,EChartProgressBarDirective
    ,FormTitlePipe,TxtLenPipe,
  InputSearchComponent,CustomTableComponent, ConfirmDialogComponent,
  InputTagAreaComponent,
  InputTagSelectComponent,
  CustomTreeComponent,
  PicturesDropListComponent,
  CardListPanelComponent, VideoSimpleCardComponent, StateScaleCardComponent,CardComponent,BusinessCardGridComponent, HeaderSquareListComponent, ImageThemeCardComponent, HintCardComponent, OrderTableCardComponent
,LineEChartsCardComponent, SwitchComponent  ,TimeToolComponent
,GalleryTargetComponent,ImageDescCardComponent,IllegalDropEventHistoryComponent,IllegalDropEventAnalyzeComponent,TreeDropListComponent,IllegalDropEventChartComponent,IllegalDropEventCardListComponent
,UserToolComponent
, LevelListPanelComponent, MixedIntoEventHistoryComponent, FullGarbageStationComponent, GarbageStationComponent, GarbageStationCamerasComponent, GalleryRollPageComponent, IllegalDropEventSummaryComponent, IllegalDropEventAnalyzeV2Component, VsClassStatisticComponent, TreeDropListV2Component
],
  exports: [
    MatTreeModule,DragDropModule, HttpClientModule,ScrollingModule,
    MatSidenavModule,MatToolbarModule,FlexLayoutModule,ReactiveFormsModule,
    MatButtonModule,MatMenuModule,MatButtonToggleModule,MatSnackBarModule,MatTabsModule
    ,DateTimePickerDirective,DateTimePickerMirrorDirective
    ,HWPaginationDirective,TouchSpinDirective,EChartBarDirective,EChartBarDirectiveV2,EChartLineDirective,HWSPlayerDirective,CardDirective
     ,EChartPieOutDirective,EChartPieInDirective,EChartPieMiddleDirective ,EChartProgressBarBoxDirective,EChartProgressBarDirective
    ,FormTitlePipe,TxtLenPipe
    ,InputSearchComponent,InputTagAreaComponent,CustomTableComponent,ConfirmDialogComponent
    ,InputTagSelectComponent,CustomTreeComponent,PicturesDropListComponent,CardListPanelComponent
    ,VideoSimpleCardComponent,StateScaleCardComponent,CardComponent,BusinessCardGridComponent
    ,HeaderSquareListComponent,ImageThemeCardComponent,HintCardComponent,OrderTableCardComponent
    ,GalleryRollPageComponent,TreeDropListV2Component
    ,LineEChartsCardComponent,SwitchComponent,TimeToolComponent
    ,GalleryTargetComponent,ImageDescCardComponent,IllegalDropEventSummaryComponent,IllegalDropEventAnalyzeV2Component,IllegalDropEventHistoryComponent,TreeDropListComponent,IllegalDropEventAnalyzeComponent,IllegalDropEventChartComponent,IllegalDropEventCardListComponent
    ,MixedIntoEventHistoryComponent,FullGarbageStationComponent,GarbageStationComponent,GarbageStationCamerasComponent,VsClassStatisticComponent
    ,UserToolComponent,LevelListPanelComponent
  ],
  providers: [DatePipe,
   ],
   entryComponents: [CardComponent,ImageThemeCardComponent,StateScaleCardComponent,OrderTableCardComponent,
    BusinessCardGridComponent,HeaderSquareListComponent,HintCardComponent,LineEChartsCardComponent
  ,GalleryRollPageComponent]
  ,
})
export class SharedModule { }
