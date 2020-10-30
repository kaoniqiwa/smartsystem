import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CameraMgrComponent } from "./resources/camera/camera-mgr/camera-mgr.component";
import { EncodeDeviceMgrComponent } from "./resources/encode-device/encode-device-mgr/encode-device-mgr.component";
import { RegionMgrComponent } from "./region/region-mgr/region-mgr.component";
import { PlatformMgrComponent } from "./platform/platform-mgr/platform-mgr.component";
import { AIModelsMgrComponent } from "./ai-models/aimodels-mgr/aimodels-mgr.component";
import { CameraAIModelMgrComponent } from './resources/camera/camera-aimodel-mgr/camera-aimodel-mgr.component';
import { SRServersMgrComponent } from "./sr-server/srservers-mgr/srservers-mgr.component";
import { EventHistoryComponent } from "./event-history/event-history.component";
import { DeployCameraComponent } from "./garbage-station/deploy-camera/deploy-camera.component";
import { GarbageStationMgrComponent } from './garbage-station/garbage-station-mgr/garbage-station-mgr.component';
import { GarbageStationComponent } from "./garbage-station/garbage-station/garbage-station.component";
import { MapDeployComponent } from './garbage-station/map-deploy/map-deploy.component';
import {FullTrashCanComponent  } from './garbage-station/full-trash-can/full-trash-can.component';
import { IllegalDropEventHistoryComponent,ContentModeEnum } from "../shared-module/business-component/event-history/illegal-drop-event-history/illegal-drop-event-history.component";

const routes: Routes = [

  {
    path: '', component: IndexComponent, children: [
      {
        path: 'resources', children: [
          { path: 'camera-mgr', component: CameraMgrComponent },
          { path: 'camera-ai-model-mgr', component: CameraAIModelMgrComponent },
          { path: 'encode-device-mgr', component: EncodeDeviceMgrComponent }
        ]
      },
      {
        path: 'regions', children: [
          { path: 'region-mgr', component: RegionMgrComponent },
        ]
      },
      {
        path: 'platform', children: [
          { path: 'platform-mgr', component: PlatformMgrComponent },
          { path: 'sr-service-mgr', component: SRServersMgrComponent }
        ]
      }
      , {
        path: 'ai-models', children: [
          { path: 'ai-models-mgr', component: AIModelsMgrComponent }
        ]
      }
      , { path: 'event-history', component: EventHistoryComponent }
      , { path: 'illegal-drop-event-history', component: IllegalDropEventHistoryComponent,data:{
         val:ContentModeEnum.Page
      } }
      , {
        path: 'garbage-station', children: [
          { path: 'map-deploy', component: MapDeployComponent },
          { path: 'deploy-camera', component: DeployCameraComponent },
          { path: 'garbage-station-mgr', component: GarbageStationMgrComponent },
          { path: 'index', component: GarbageStationComponent },
          { path:'full-trashcan',component:FullTrashCanComponent}
         
        ]
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AIOPSystemRoutingModule { } 