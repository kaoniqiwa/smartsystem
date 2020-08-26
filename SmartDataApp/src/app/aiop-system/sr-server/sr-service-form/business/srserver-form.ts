import { Injectable } from "@angular/core";
import { SRServer, SRServerAddress } from "../../../../data-core/model/sr-server";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FormStateEnum } from "../../../../common/tool/table-form-helper";
import { MessageBar } from "../../../../common/tool/message-bar";
import { SRServiceRequestSerivce } from "../../../../data-core/repuest/sr-service.service";
import "../../../../common/string/hw-string";
@Injectable()
export class SRServiceService {
    addressForm: FormGroup[] = new Array();
    baseForm: FormGroup;
    editItem: SRServer;
    messageBar = new MessageBar();
    formState: FormStateEnum;
    addressTabSelectedIndex = 0;
    constructor(private fb: FormBuilder, private srRequestSerivce: SRServiceRequestSerivce) {

        this.baseForm = this.fb.group({
            Name: [''],
            ProtocolType: ['Howell'],
            Username: ['1'],
            Password: ['1']
        });
        var address = this.fb.group({
            IPAddress: ['192.168.1.1'],
            Port: ['8800'],
            IsInternet: ['1'],
            IsDefault: ['1'],
            RtspPort: ['554'],
            RtmpPort: ['1935'],
            HttpPort: [''],
            WsPort: [''],
        });
        this.addressForm.push(address);
    }

    plusAddressForm() {
        if (this.addressForm.length < 7) {
            const address = this.fb.group({
                IPAddress: ['192.168.12.1'],
                Port: ['8800'],
                IsInternet: ['1'],
                IsDefault: ['1'],
                RtspPort: ['554'],
                RtmpPort: ['1935'],
                HttpPort: [''],
                WsPort: [''],
            });
            this.addressForm.push(address);
        }
    }

    delAddressForm(index: number) {
        if (this.addressForm.length > 1) {
            if (this.addressForm.length - 1 != index) {
                this.messageBar.response_warning('请依次删除该项');
                return;
            }
            this.addressForm.splice(index, 1);
            /**该时候的选中表单 */
            if (index == this.addressTabSelectedIndex) this.addressTabSelectedIndex = 0;
        }
    }

    async defaultForm(editItem: SRServer) {
        if (editItem) {
            this.editItem = editItem;
            this.baseForm.patchValue({
                Name: editItem.Name,
                ProtocolType: editItem.ProtocolType,
                Username: editItem.Username,
                Password: editItem.Password
            });
            if (editItem.Addresses)
                for (let i = 0; i < editItem.Addresses.length; i++) {
                    if(i>0)this.plusAddressForm();
                    const address = editItem.Addresses[i];
                    this.addressForm[i].patchValue({
                        IPAddress: address.IPAddress,
                        Port: address.Port,
                        IsInternet: address.IsInternet ? '1' : '0',
                        IsDefault: address.IsDefault ? '1' : '0',
                        RtspPort: address.RtspPort || '',
                        RtmpPort: address.RtmpPort || '',
                        HttpPort: address.HttpPort || '',
                        WsPort: address.WsPort || '',
                    });
                }
            this.formState = FormStateEnum.edit;
        }
        else {
            this.formState = FormStateEnum.create;

        }
    }

    checkForm(item: FormField) {
        var check =true;
        if (item.Name == '') {
            this.messageBar.response_warning('名称不能为空'); 
            check = false;            
        }
        else if (item.Address) {
            item.Address.map(x => {
                if (x.IPAddress=='' || x.IPAddress.validIP()==false) {
                    this.messageBar.response_warning('IP地址格式不对');
                    check = false; 
                }
                else if (x.Port=='' || x.Port.validIPPort()==false) {
                    this.messageBar.response_warning('端口号格式不对'); 
                    check = false;
                }
            });
        }
        return check;
    }

    async saveFrom(item: FormField, successFn: (success: boolean, item: SRServer, formState: FormStateEnum) => void) {
        const check = this.checkForm(item);
        var model: SRServer;
        model = (this.editItem && this.formState == FormStateEnum.edit) ? this.editItem : new SRServer();
        if (check) {
            model.ProtocolType = item.ProtocolType;
            model.Username = item.Username;
            model.Password = item.Password;
            model.Name = item.Name;
         
            if (item.Address) {
                model.Addresses = new Array();
                item.Address.map(x => {
                    const address = new SRServerAddress();
                    address.HttpPort = Number.parseInt(x.HttpPort);
                    address.IPAddress = x.IPAddress
                    address.IsDefault = x.IsDefault == '1' ? true : false;
                    address.IsInternet = x.IsInternet == '1' ? true : false;
                    address.Port = Number.parseInt(x.Port);
                    address.RtmpPort = x.RtmpPort ? Number.parseInt(x.RtmpPort) : null;
                    address.RtspPort = x.RtspPort ? Number.parseInt(x.RtspPort) : null;
                    address.WsPort = x.WsPort ? Number.parseInt(x.WsPort) : null;
                    address.HttpPort = x.HttpPort ? Number.parseInt(x.HttpPort) : null;
                    model.Addresses.push(address);
                });
            }

            if (this.formState == FormStateEnum.create) {
                model.Id = '';

                console.log(model);
                const response = await this.srRequestSerivce.create(model);
                if (response.status == 200) {
                    this.messageBar.response_success();
                    successFn(true, response.data.Data, this.formState);
                }
            }
            else if (this.formState == FormStateEnum.edit) {
                const response = await this.srRequestSerivce.set(model);
                if (response.status == 200) {
                    this.messageBar.response_success();
                    successFn(true, response.data.Data, this.formState);
                }
            }
        }
    }
}

export class BaseFiled {
    /**平台名称(可选) */
    Name: string;
    /**用户名，AccessID(可选) */
    Username: string;
    /**密码，AccessKEY(可选) */
    Password: string;
    /**协议类型:Artemis */
    ProtocolType: string;
}
export class FormField extends BaseFiled {

    /**连接地址 */
    Address: ServerAddress[]
}

/**服务器地址列表 */
export interface ServerAddress {
    /**IP地址 */
    IPAddress: string;
    /**端口号 */
    Port: string;
    /**是否为互联网IP */
    IsInternet: string;
    /**RTSP端口号(可选)，默认554 */
    RtspPort: string
    /**RTMP端口号(可选)，默认1935 */
    RtmpPort: string
    /**HTTP端口号(可选)，默认和服务器端口号相同 */
    HttpPort: string
    /**Websocket端口号(可选)，默认和服务器端口号相同 */
    WsPort: string
    /**是否为默认IP */
    IsDefault: string

}