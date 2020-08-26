import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CameraMgrComponent } from "./resources/camera/camera-mgr/camera-mgr.component";
import { EncodeDeviceMgrComponent } from "./resources/encode-device/encode-device-mgr/encode-device-mgr.component";
import { RegionMgrComponent } from "./region/region-mgr/region-mgr.component";
import { PlatformMgrComponent } from "./platform/platform-mgr/platform-mgr.component";
import { AIModelsMgrComponent } from "./ai-models/aimodels-mgr/aimodels-mgr.component";
import { CameraAIModelMgrComponent } from './resources/camera/camera-aimodel-mgr/camera-aimodel-mgr.component';
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
          {
            path: 'platform-mgr', component: PlatformMgrComponent
          }
        ]
      }
      , {
        path: 'ai-models', children: [
          {
            path: 'ai-models-mgr', component: AIModelsMgrComponent
          }
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