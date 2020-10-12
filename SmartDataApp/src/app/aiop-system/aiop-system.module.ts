
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SharedModule } from '../shared-module/shared.module';
import { IndexComponent } from './index/index.component';
import { TimeToolComponent } from "./index/time/time-tool.component";
import { UserToolComponent } from "./index/user-tool/user-tool.component";
import { AlarmPointToolComponent } from "./index/alarm-point-tool/alarm-point-tool.component";
import { SideNavMenuComponent } from "./index/side-nav-menu/side-nav-menu.component";
import {HistoryLinkToolComponent} from './index/history-link-tool/history-link-tool.component'
import { AIOPSystemRoutingModule } from "./aiop-system-routing.module";

import { CameraFormComponent } from './resources/camera/camera-form/camera-form.component';
import { CameraMgrComponent } from './resources/camera/camera-mgr/camera-mgr.component';

import {EncodeDeviceMgrComponent   } from "./resources/encode-device/encode-device-mgr/encode-device-mgr.component";
import {EncodeDeviceFormComponent   } from "./resources/encode-device/encode-device-form/encode-device-form.component";
import { RegionMgrComponent } from './region/region-mgr/region-mgr.component';
import { RegionFormComponent } from './region/region-form/region-form.component'; 
import { PlatformMgrComponent } from './platform/platform-mgr/platform-mgr.component';
import { PlatformFormComponent } from './platform/platform-form/platform-form.component';
import { AIModelsMgrComponent } from './ai-models/aimodels-mgr/aimodels-mgr.component';
import { AIModelFormComponent } from './ai-models/aimodel-form/aimodel-form.component';
import { CameraAIModelMgrComponent } from './resources/camera/camera-aimodel-mgr/camera-aimodel-mgr.component';
import { SRServersMgrComponent } from './sr-server/srservers-mgr/srservers-mgr.component';
import { SRServerFormComponent } from './sr-server/sr-service-form/srserver-form.component';
import { RegionCameraCopyComponent } from './resources/camera/region-camera-copy/region-camera-copy.component';
import { EventHistoryComponent } from './event-history/event-history.component';
import { DeployCameraComponent } from './garbage-station/deploy-camera/deploy-camera.component';
import { TrashIconsListComponent } from './garbage-station/station-chart/trash-icons-list/trash-icons-list.component';
import { CameraRegionMoveComponent } from './resources/camera/camera-region-move/camera-region-move.component';
import { GarbageStationMgrComponent } from './garbage-station/garbage-station-mgr/garbage-station-mgr.component';
import { StationChartComponent } from './garbage-station/station-chart/station-chart.component';
import { DivisionStationTreeComponent } from './garbage-station/division-station-tree/division-station-tree.component';
import { RegionCameraTreeComponent } from './garbage-station/region-camera-tree/region-camera-tree.component';
import { GarbageStationComponent } from './garbage-station/garbage-station/garbage-station.component';
import { GarbageStationFormComponent } from './garbage-station/garbage-station-form/garbage-station-form.component';
@NgModule({
  imports: [
    CommonModule,
    AIOPSystemRoutingModule,
    SharedModule,
  ],
  declarations: [
  IndexComponent,TimeToolComponent,UserToolComponent,AlarmPointToolComponent,
  SideNavMenuComponent,HistoryLinkToolComponent,
  CameraFormComponent,  CameraMgrComponent,
  EncodeDeviceMgrComponent,EncodeDeviceFormComponent, RegionMgrComponent,
  RegionFormComponent, PlatformMgrComponent, PlatformFormComponent, AIModelsMgrComponent, AIModelFormComponent
  , CameraAIModelMgrComponent, SRServersMgrComponent, SRServerFormComponent, RegionCameraCopyComponent, EventHistoryComponent
  , DeployCameraComponent, TrashIconsListComponent
  , CameraRegionMoveComponent, GarbageStationMgrComponent, StationChartComponent, DivisionStationTreeComponent, RegionCameraTreeComponent, GarbageStationComponent, GarbageStationFormComponent ],
  exports:[
  ]
})
export class AIOPSystemModule { }
