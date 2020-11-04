import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Platform } from "../../../../data-core/model/aiop/platform";
import "../../../../common/string/hw-string";
import { MessageBar } from "../../../../common/tool/message-bar";
import { FormStateEnum, FormAttribute, ListAttribute } from "../../../../common/tool/table-form-helper";
import { PlatformRequestSerivce } from "../../../../data-core/repuest/platform.service";
import { Protocol } from "../../../../data-core/model/aiop/protocol";
@Injectable()
export class PlatformFormService extends ListAttribute implements FormAttribute {
    form: FormGroup;
    eventCodesForm: FormGroup[] = new Array();
    editItem: Platform;
    messageBar = new MessageBar();
    formState: FormStateEnum;
    protocols = new Array<Protocol>();
    eventCodeTabSelectedIndex = 0;
    constructor(private fb: FormBuilder, private platformRequestSerivce: PlatformRequestSerivce) {
        super();
        this.form = this.fb.group({
            Name: [''],
            Username: [''],
            Password: [''],
            ProtocolType: [''],
            Url_: [''],
            Port: [''],
            EventRecvPort: [''],
            EventRecvIPAddress: ['']
        });
        var eventCode = this.fb.group({
            EventCode1: [''],
            EventCode2: [''],
            EventCode3: [''],
            EventCode4: [''],
            EventCode5: [''],
            EventCode6: [''],
            EventCode7: [''],
            EventCode8: ['']
        });
        this.eventCodesForm.push(eventCode);
    }

    async getProtocols() {
        const response = await this.platformRequestSerivce.protocol().toPromise();
        this.protocols = response.Data;
    }

    plusEventCodeForm() {
        if (this.eventCodesForm.length < 7) {
            const code = this.fb.group({
                EventCode1: [''],
                EventCode2: [''],
                EventCode3: [''],
                EventCode4: [''],
                EventCode5: [''],
                EventCode6: [''],
                EventCode7: [''],
                EventCode8: ['']
            });
            this.eventCodesForm.push(code);
        }
    }

    delEventCodeForm(index: number) {
        if (this.eventCodesForm.length > 1) {
            if (this.eventCodesForm.length - 1 != index) {
                this.messageBar.response_warning('请依次删除该项');
                return;
            }
            this.eventCodesForm.splice(index, 1);
            /**该时候的选中表单 */
            if (index == this.eventCodeTabSelectedIndex) this.eventCodeTabSelectedIndex = 0;
        }
    }

    async defaultForm(editItem: Platform) {

        if (editItem) {
            this.editItem = editItem;
            this.form.patchValue({
                Name: editItem.Name,
                SoftwareVersion: editItem.SoftwareVersion,
                Username: editItem.Username,
                Password: editItem.Password,
                ProtocolType: editItem.ProtocolType,
                Url_: editItem.Url.toIP(),
                Port: editItem.Url.toIPPort(),
                EventRecvIPAddress: editItem.EventRecvIPAddress,
                EventRecvPort: editItem.EventRecvPort 
            });
            if (editItem.EventCodes) {
                var a = new Map<string, number>(), no = 1, groupNo = 0;
                for (let i = 0; i < editItem.EventCodes.length; i++) {                    
                    a.set('EventCode' + no, editItem.EventCodes[i]);                    
                    no += 1;
                    if (no == 9) {
                        this.eventCodesForm[groupNo].patchValue({
                            EventCode1: a.get('EventCode1'),
                            EventCode2: a.get('EventCode2')||'',
                            EventCode3: a.get('EventCode3')||'',
                            EventCode4: a.get('EventCode4')||'',
                            EventCode5: a.get('EventCode5')||'',
                            EventCode6: a.get('EventCode6')||'',
                            EventCode7: a.get('EventCode7')||'',
                            EventCode8: a.get('EventCode8')||'',
                        });
                        groupNo +=1;
                        a = new Map<string, number>();
                        no = 1;
                        this.plusEventCodeForm();
                    }
                } 
                if(a.size<9&&a.size> 0){
                    this.eventCodesForm[groupNo].patchValue({
                        EventCode1: a.get('EventCode1')||'',
                        EventCode2: a.get('EventCode2')||'',
                        EventCode3: a.get('EventCode3')||'',
                        EventCode4: a.get('EventCode4')||'',
                        EventCode5: a.get('EventCode5')||'',
                        EventCode6: a.get('EventCode6')||'',
                        EventCode7: a.get('EventCode7')||'',
                        EventCode8: a.get('EventCode8')||'',
                    });
                }
            }


            this.formState = FormStateEnum.edit;
        }
        else {
            this.formState = FormStateEnum.create;
            for (const item of this.protocols) {

                this.form.patchValue({
                    Name: item.Name,
                    Username: item.Username,
                    Password: item.Password,
                    Port: item.Url.toIPPort(),
                    Url_: item.Url.toIP(),
                    ProtocolType: item.ProtocolType
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
        return true;
    }

    async saveFrom(item: FormField, successFn: (success: boolean, item: Platform, formState: FormStateEnum) => void) {
        const check = this.checkForm(item);
        var model: Platform;
        model = (this.editItem && this.formState == FormStateEnum.edit) ? this.editItem : new Platform();
        if (check) {
            model.ProtocolType = item.ProtocolType;
            model.Url = 'http://' + item.Url_ + ':' + item.Port;
            model.Username = item.Username;
            model.Password = item.Password;
            model.Name = item.Name;
            model.State = 0;
            model.EventRecvIPAddress=item.EventRecvIPAddress;
            model.EventRecvPort=item.EventRecvPort;
            model.EventCodes=item.EventCodes;
            model.UpdateTime = new Date().toISOString();
            if (this.formState == FormStateEnum.create) {
                model.Id = '';
                model.CreateTime = new Date().toISOString();

                const response = await this.platformRequestSerivce.create(model).toPromise();
                if (response.FaultCode == 0) {
                    this.messageBar.response_success();
                    successFn(true, response.Data, this.formState);
                }
            }
            else if (this.formState == FormStateEnum.edit) {
                const response = await this.platformRequestSerivce.set(model).toPromise();
                if (response.FaultCode == 0) {
                    this.messageBar.response_success();
                    successFn(true, response.Data, this.formState);
                }
            }
        }
    }
}

export interface FormField {

    /**平台名称(可选) */
    Name: string;
    /**用户名，AccessID(可选) */
    Username: string;
    /**密码，AccessKEY(可选) */
    Password: string;
    /**协议类型:Artemis */
    ProtocolType: string;
    /**连接地址 */
    Url_: string;

    Port: string; 

    EventRecvPort: number;
    /**事件接收的本地IP地址(可选) */
    EventRecvIPAddress: string;
    /**订阅事件编码列表(可选) */
    EventCodes: number[];
}