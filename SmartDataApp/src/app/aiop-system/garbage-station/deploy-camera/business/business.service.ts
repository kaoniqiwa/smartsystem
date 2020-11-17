
import { Injectable } from "@angular/core";
import { Camera } from "../../../../data-core/model/aiop/camera";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { FlatNode, ColorEnum ,RightBtn} from "../../../../shared-module/custom-tree/custom-tree";
import { ConfirmDialog} from "../../../../shared-module/confirm-dialog/confirm-dialog.component";
import { DataService as CameraDataService } from "../business/data.service";
import { Camera as StationCamera } from "../../../../data-core/model/waste-regulation/camera";
import { CameraUsageDataEnum, CanTypeEnum } from "../../../../common/tool/enum-helper";
import { MessageBar } from "../../../../common/tool/message-bar";
import { House } from "../../station-chart/business/station-chart";
@Injectable()
export class BusinessService {
    bindItem: FlatNode;
    bindingCamera: Camera;
    station: GarbageStation;
    confirmDialog_:ConfirmDialog;
    readonly link = [new RightBtn('howell-icon-Link','1')];
    findNodeFn: (id: string) => FlatNode;
    // cameraNodesFn: () => FlatNode[];
    cameraDataService: CameraDataService;
    msg = new MessageBar();
    positionNoMap = new Map<CanTypeEnum, number>();
    readonly multifacetedPostion = 15
    constructor() {
        this.positionNoMap.set(CanTypeEnum.Dry, 11);
        this.positionNoMap.set(CanTypeEnum.Wet, 12);
        this.positionNoMap.set(CanTypeEnum.Recycle, 13);
        this.positionNoMap.set(CanTypeEnum.Hazard, 14);
    }

    async bindingItem(liItem: { id: string, name: string, position: number, no: number }) {
        if (this.bindingCamera && this.bindItem && this.station) {
            this.bindItem.labelColor = ColorEnum.green;
            this.bindItem.rightClassBtn = new Array();
            liItem.id = this.bindingCamera.Id;
            liItem.name = this.bindingCamera.Name;
            await this.addCamera(liItem.id, liItem.position, liItem.no, liItem.name, this.station.Id)

        }
        else {
            this.confirmDialog_ = new ConfirmDialog();
            this.confirmDialog_.cancelFn = () => {
                this.confirmDialog_ = null;
            }
            this.confirmDialog_.content = '确定删除该摄像机配置';
            this.confirmDialog_.okFn =async () => {             
                this.confirmDialog_ = null;    
                const node = this.findNodeFn(liItem.id);
                node.labelColor = ColorEnum.lightbBlue;
                node.rightClassBtn = this.link;
                await this.delCamera(liItem.id);
                liItem.id = '';
                liItem.name = liItem.position + '';                        
            }
        }
        this.bindingCamera = null;
        this.bindItem = null;
    }


    async addCamera(cameraId: string, position: number, no: number, name: string, stationId: string) {
        var cameras = await this.cameraDataService.getCamera(stationId, cameraId)
            , edit = cameras.length > 0, camera: StationCamera;
        if (cameras.length == 0) {
            camera = new StationCamera();
            camera.Id = cameraId;
            camera.CreateTime = new Date().toISOString();
        }
        else camera = cameras[0];
        camera.Name = name;
        camera.UpdateTime = new Date().toISOString();
        camera.GarbageStationId = stationId;
        camera.PositionNo = no;
        if (this.positionNoMap.get(CanTypeEnum.Dry) == position || this.multifacetedPostion == position)
            camera.CameraUsage = CameraUsageDataEnum.Dry;
        else if (this.positionNoMap.get(CanTypeEnum.Wet) == position)
            camera.CameraUsage = CameraUsageDataEnum.Wet;
        else camera.CameraUsage = CameraUsageDataEnum.Recycle;

        var result = false;  
        
        if (edit) result = await this.cameraDataService.editStationCamera(camera);
        else result = await this.cameraDataService.addStationCamera(camera);
        if (result)
            this.msg.response_success();
    }

    async delCamera(cameraId: string) {
        const camera = this.cameraDataService.cameras.find(x => x.Id == cameraId);
        const result = await this.cameraDataService.delStationCamera(camera.GarbageStationId,camera.Id);
        if (result)
            this.msg.response_success();
    }

    // fillCameraTreeState(cameras: StationCamera[]) {
    //     const nodes = this.cameraNodesFn();
    //     if (cameras) {
    //         for (const c of cameras) {
    //             const node = nodes.find(x => x.id == c.Id);
    //             if (node && c.PositionNo) {
    //                 node.labelColor = ColorEnum.green;
    //                 node.rightClassBtn = new Array();
    //             }
    //         }
    //     }
    // }

    async fillHouseCameraPostion(house: House, stationId: string) {
        var cameras = await this.cameraDataService.getStationCameras(stationId);
        cameras = cameras.sort(function (a, b) {
            return a.PositionNo - b.PositionNo;
        });  

        this.cameraDataService.cameras = cameras;

        for (const c of cameras) {
            for (const x1 of house.cameraPosition.outside)
                if (x1.no == c.PositionNo && x1.id == '') {
                    x1.id = c.Id;
                    x1.name = c.Name;
                    break;
                }
            // else if (c.PositionNo == this.multifacetedPostion) {
            //     for (const x1 of house.cameraPosition.inside.li2)
            //         if (x1.position == c.PositionNo && x1.id == '') {
            //             x1.id = c.Id;
            //             x1.name = c.Name;
            //             break;
            //         }
            // }
            for (const x1 of house.cameraPosition.inside.li1)
                if (x1.no == c.PositionNo && x1.id == '') {
                    x1.id = c.Id;
                    x1.name = c.Name;
                    break;
                }
        }

    }
}