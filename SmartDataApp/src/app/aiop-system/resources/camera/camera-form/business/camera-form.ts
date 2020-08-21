import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { FormStateEnum, ListAttribute ,FormAttribute} from "../../../../../common/tool/table-form-helper";
import { MessageBar } from "../../../../../common/tool/message-bar";
import { Camera } from "../../../../../data-core/model/camera";
import { EncodeDeviceRequestService, CameraRequestService } from "../../../../../data-core/repuest/resources.service";
import { GetEncodeDevicesParams } from "../../../../../data-core/model/encode-devices-params"; 
import { EncodeDevice } from "../../../../../data-core/model/encode-device"; 
@Injectable()
export class CameraFormService extends ListAttribute implements FormAttribute {
    form: FormGroup;
    editItem: Camera;
    messageBar = new MessageBar();
    formState: FormStateEnum;
    encodeDevices = new Array<EncodeDevice>();
    constructor(private encodeDeviceRequestService: EncodeDeviceRequestService
        , private cameraRequestService: CameraRequestService) {
        super();
        this.form = new FormGroup({
            Name: new FormControl(''),
            CameraType: new FormControl('1'),
            EncodeDeviceId: new FormControl(''),
            ChannelNo: new FormControl('1'),
            PTZControllable: new FormControl(''),
            Storable: new FormControl('')
        });
    }

    async loadEncodeDevices() {
        const param = new GetEncodeDevicesParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const response = await this.encodeDeviceRequestService.list(param);
        if (response.status == 200) {
            for (const x of response.data.Data.Data) {
                this.encodeDevices.push(x);
            }
        }
    }

    async defaultForm(editItem: Camera) {
        await  this.loadEncodeDevices();
        this.loadEncodeDevicesDrop();
        if (editItem) {
            this.editItem = editItem;
            this.form.patchValue({
                Name: editItem.Name,
                CameraType: editItem.CameraType,
                EncodeDeviceId: editItem.EncodeDeviceId,
                ChannelNo: editItem.ChannelNo,
                PTZControllable: editItem.PTZControllable == true ? 1 : 0,
                Storable: editItem.Storable == true ? 1 : 0
            });
            this.formState = FormStateEnum.edit;
        }
        else {
            this.formState = FormStateEnum.create;
        }
    }

    loadEncodeDevicesDrop(){
        for(const x of this.encodeDevices){
            this.form.patchValue({
                EncodeDeviceId:x.Id,
                Name:'a'+ new Date().valueOf()
            });
            break;
        }
    }

    checkForm(item: FormField) {
        if (item.Name == '') {
            this.messageBar.response_warning('名称不能为空');
            return false;
        }
        return true;
    }

    async saveFrom(item: FormField, successFn: (success: boolean, item: Camera, formState: FormStateEnum) => void) {
        const check = this.checkForm(item);
        var camera: Camera;
        camera = (this.editItem && this.formState == FormStateEnum.edit) ? this.editItem : new Camera();
        if (check) { 
            camera.ResourceType = 'Camera';
            camera.CameraType = Number.parseInt(item.CameraType);
            camera.Name=item.Name;
            camera.CameraState =0;
            camera.ChannelNo = item.ChannelNo;
            camera.EncodeDeviceId = item.EncodeDeviceId;
            camera.PTZControllable =item.PTZControllable == '1' ?true :false;
            camera.Storable=item.Storable== '1' ?true :false;
            camera.UpdateTime = new Date().toISOString();
            if (this.formState == FormStateEnum.create) {
                camera.Id = '';
                camera.CreateTime = new Date().toISOString();
                const response = await this.cameraRequestService.create(camera);
                if (response.status == 200) { 
                    this.messageBar.response_success();
                    successFn(true, response.data.Data, this.formState);
                }
            }
            else if (this.formState == FormStateEnum.edit) {  
                const response = await this.cameraRequestService.set(camera); 
                if (response.status == 200) { 
                    this.messageBar.response_success();
                    successFn(true, response.data.Data, this.formState);
                }
            }
        }
    }
}


export interface FormField {
    Name: string,
    CameraType: string;
    EncodeDeviceId: string;
    ChannelNo: number;
    PTZControllable: string;
    Storable: string;
}