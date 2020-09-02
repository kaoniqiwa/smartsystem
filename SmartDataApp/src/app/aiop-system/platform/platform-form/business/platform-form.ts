import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Platform } from "../../../../data-core/model/platform"; 
import  "../../../../common/string/hw-string";
import { MessageBar } from "../../../../common/tool/message-bar";
import { FormStateEnum, FormAttribute, ListAttribute } from "../../../../common/tool/table-form-helper";
import {PlatformRequestSerivce  } from "../../../../data-core/repuest/platform.service";
import { Protocol } from "../../../../data-core/model/protocol";
@Injectable()
export class  PlatformFormService  extends ListAttribute implements FormAttribute{
    form: FormGroup;
    editItem:  Platform;
    messageBar = new MessageBar();
    formState: FormStateEnum; 
    protocols = new Array<Protocol>();
    constructor(private platformRequestSerivce: PlatformRequestSerivce) {
        super();
        this.form = new FormGroup({
            Name: new FormControl(''),
            Username: new FormControl(''),
            Password: new FormControl(''),
            ProtocolType: new FormControl(''),
            Url_: new FormControl(''),
            Port: new FormControl(''),            
            SoftwareVersion: new FormControl('')
        });
    }

   async getProtocols(){
       const response = await this.platformRequestSerivce.protocol().toPromise();
       this.protocols=response.Data; 
    } 
 

    async defaultForm(editItem: Platform) {
   
        if (editItem) {
            this.editItem = editItem;
            this.form.patchValue({
                Name: editItem.Name,
                SoftwareVersion:editItem.SoftwareVersion,
                Username: editItem.Username,
                Password: editItem.Password,
                ProtocolType: editItem.ProtocolType,
                Url_: editItem.Url.toIP(),
                Port: editItem.Url.toIPPort()
            });
            this.formState = FormStateEnum.edit;
        }
        else {
            this.formState = FormStateEnum.create;
            for (const item of this.protocols) {
              
                this.form.patchValue({
                    Name: item.Name,
                    Username: item.Username ,
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
            model.Url = 'http://'+item.Url_ +':'+ item.Port;
            model.Username = item.Username;
            model.Password = item.Password;
            model.Name=item.Name;
            model.State =0; 
            model.SoftwareVersion = item.SoftwareVersion;
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

   Port:string;
   /**软件版本(可选) */
   SoftwareVersion: string; 
}