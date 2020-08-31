import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { MessageBar } from "../../../../../common/tool/message-bar";
import '../../../../../common/string/hw-string';
import { EncodeDevice } from "../../../../../data-core/model/encode-device";
import { EncodeDeviceRequestService, LabelRequestService, ResourceLabelRequestService } from "../../../../../data-core/repuest/resources.service";
import { InputTagArea } from "../../../../../shared-module/input-tag-area/input-tag-area";
import { ResourceLabel } from "../../../../../data-core/model/resource-label"; 
import { ListAttribute, FormAttribute, FormStateEnum } from "../../../../../common/tool/table-form-helper"; 
import { InputLabelService } from "../../../../common/input-label";
@Injectable()
export class EncodeDeviceFormService extends InputLabelService implements FormAttribute {
    form: FormGroup;
    editItem: EncodeDevice;
    messageBar = new MessageBar();
    inputTagArea = new Array<InputTagArea>();
    protocolTypes = new Array<string>();
    formState: FormStateEnum;
    createLabelFn = async (item: InputTagArea, fn: (id: string) => void) => {
        await this.createLabel(item, (id) => fn(id));
    }
    delLabelFn = async (item: InputTagArea, fn: (success: boolean) => void) => {
        await this.delLabel(item, (success) => fn(success));
    }
    constructor(private encodeDeviceRequestService: EncodeDeviceRequestService
        , public labelRequestService: LabelRequestService
        , public resourceLabelRequestService: ResourceLabelRequestService) {
        super(labelRequestService, resourceLabelRequestService);
        this.form = new FormGroup({
            Name: new FormControl(''),
            TransType: new FormControl(''),
            ProtocolType: new FormControl(''),
            Model: new FormControl(''),
            SerialNumber: new FormControl(''),
            Manufactory: new FormControl(''),
            Url_: new FormControl(''),
            Port: new FormControl(''),
            Username: new FormControl(''),
            Password: new FormControl(''),
            FirmwareVersion: new FormControl(''),
            SoftwareVersion: new FormControl(''),
            HardwareVersion: new FormControl(''),
            DeviceType: new FormControl(''),
        });
    }

    async createResourceLabel(item: InputTagArea) {
        if (item && item.text) {
            let model = new ResourceLabel();
            model.Id = '';
            model.Name = item.text;
            const response = await this.labelRequestService.create(model).toPromise();

            if (response.FaultCode == 0) {
                this.messageBar.response_success();
                return response.Data.Id;
            }
        }
    } 

    async defaultForm(editItem: EncodeDevice) {
        const response = await this.encodeDeviceRequestService.protocol().toPromise();
        for (const item of response.Data) 
            this.protocolTypes.push(item.ProtocolType);
        var transType = TransTypeEnum.UDP;
        if (editItem) {
            this.editItem=editItem;
            this.form.patchValue({
                Name: editItem.Name,
                Username: editItem.Username,
                Password: editItem.Password,
                Port: editItem.Url.toIPPort(),
                Url_: editItem.Url.toIP(),
                ProtocolType: editItem.ProtocolType,
                TransType: editItem.TransType,
                Model: editItem.Model,
                SerialNumber: editItem.SerialNumber,
                Manufactory: editItem.Manufactory,
                FirmwareVersion: editItem.FirmwareVersion,
                SoftwareVersion: editItem.SoftwareVersion,
                HardwareVersion: editItem.HardwareVersion,
                DeviceType: editItem.DeviceType
            });
            this.addLabel2=editItem.Labels;
            this.formState = FormStateEnum.edit;
        }
        else {
            this.formState = FormStateEnum.create;
            for (const item of response.Data) {
                // this.protocolTypes.push(item.ProtocolType);
                if (item.Url.indexOf('https') > -1)
                    transType = TransTypeEnum.TCP;
                else if (item.Url.indexOf('tcp') > -1)
                    transType = TransTypeEnum.UDP;
                this.form.patchValue({
                    Name: item.Name,
                    Username: item.Username || '',
                    Password: item.Password || '',
                    Port: item.Url.toIPPort(),
                    Url_: item.Url.toIP(),
                    ProtocolType: item.ProtocolType,
                    TransType: transType
                })
                break;
            }
        }

    }

    checkForm(item: FormField) {
        if (item.Name == '') {
            this.messageBar.response_warning('名称不能为空');
            return false;
        }
        else if (item.Url_ == '' || item.Url_.validIP() == false) {
            this.messageBar.response_warning('IP地址格式不对');
            return false;
        }
        else if (item.Port == '' || item.Port.validIPPort() == false) {
            this.messageBar.response_warning('端口号格式不对');
            return false;
        }
        return true;
    }

    async saveFrom(item: FormField, successFn: (success: boolean, item: EncodeDevice, formState: FormStateEnum) => void) {
        const check = this.checkForm(item);
        var dev: EncodeDevice;
        dev = (this.editItem && this.formState == FormStateEnum.edit) ? this.editItem : new EncodeDevice();
        if (check) {
            const resourceType = 'EncodeDevice';
            if (item.TransType == TransTypeEnum.UDP)
                dev.Url = 'tcp://' + item.Url_ + ':' + item.Port + '/';
            else if (item.TransType == TransTypeEnum.TCP)
                dev.Url = 'https://' + item.Url_ + ':' + item.Port + '/';
            dev.Username = item.Username;
            if (item.TransType)
                dev.TransType = Number.parseInt(item.TransType);
            dev.ProtocolType = item.ProtocolType;
            dev.Model = item.Model;
            dev.SerialNumber = item.SerialNumber;
            dev.Manufactory = item.Manufactory;
            dev.FirmwareVersion = item.FirmwareVersion;
            dev.SoftwareVersion = item.SoftwareVersion;
            dev.HardwareVersion = item.HardwareVersion;
            dev.Name = item.Name;
            dev.ResourceType = resourceType;
            dev.DeviceType = item.DeviceType;
            dev.UpdateTime = new Date().toISOString();
            if (this.formState == FormStateEnum.create) {
                dev.Id = '';
                dev.CreateTime = new Date().toISOString();
                const response = await this.encodeDeviceRequestService.create(dev).toPromise();
                if (response.FaultCode == 0) { 
                    this.messageBar.response_success();

                    response.Data.Labels = new  Array<ResourceLabel>();                    
                    await this.forBindLabelForm(response.Data.Id,response.Data.Labels,this._tagSource);
                    this.fillResourceLabel(response.Data.Labels,this._tagSource);
                    successFn(true, response.Data, this.formState);
                }
            }
            else if (this.formState == FormStateEnum.edit) { 
                const response = await this.encodeDeviceRequestService.set(dev).toPromise();
                if (response.FaultCode == 0) { 
                    dev.Id =  response.Data.Id;
                    this.messageBar.response_success();
                    await this.forBindLabelForm(response.Data.Id, dev.Labels,this._tagSource);
                    this.fillResourceLabel(dev.Labels,this._tagSource);
                    successFn(true, dev, this.formState);
                }
            }
        }
    } 

}

export enum TransTypeEnum {
    UDP = '0'
    , TCP = '1'
}

export interface FormField {
    Name: string,
    TransType: string,
    ProtocolType: string,
    Model: string,
    SerialNumber: string,
    Manufactory: string,
    Url_: string,
    Port: string,
    Username: string,
    Password: string,
    FirmwareVersion: string,
    SoftwareVersion: string,
    HardwareVersion: string,
    DeviceType: string
}