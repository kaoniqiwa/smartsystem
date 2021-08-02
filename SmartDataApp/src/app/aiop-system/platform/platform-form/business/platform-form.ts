import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Platform } from "../../../../data-core/model/aiop/platform";
import "../../../../common/string/hw-string";
import { MessageBar } from "../../../../common/tool/message-bar";
import {
  FormStateEnum,
  FormAttribute,
  ListAttribute,
} from "../../../../common/tool/table-form-helper";
import { PlatformRequestSerivce } from "../../../../data-core/repuest/platform.service";
import { Protocol } from "../../../../data-core/model/aiop/protocol";
@Injectable()
export class PlatformFormService
  extends ListAttribute
  implements FormAttribute
{
  form: FormGroup;
  editItem: Platform;

  formState: FormStateEnum;
  protocols = new Array<Protocol>();
  constructor(
    private fb: FormBuilder,
    private platformRequestSerivce: PlatformRequestSerivce
  ) {
    super();
    this.form = new FormGroup({
      Name: new FormControl(""),
      Username: new FormControl(""),
      Password: new FormControl(""),
      ProtocolType: new FormControl(""),
      Url_: new FormControl(""),
      Port: new FormControl(""),
      EventRecvPort: new FormControl(""),
      EventRecvIPAddress: new FormControl(""),
      EventCodes: new FormControl(""),
    });
  }

  async getProtocols() {
    const response = await this.platformRequestSerivce.protocol().toPromise();
    this.protocols = response.Data;
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
        EventRecvPort: editItem.EventRecvPort,
      });
      if (editItem.EventCodes) {
        var eventCodes = "";
        editItem.EventCodes.map((x) => {
          eventCodes += `${x}\r\n`;
        });
        this.form.patchValue({
          EventCodes: eventCodes,
        });
      }
      this.formState = FormStateEnum.edit;
    } else {
      this.formState = FormStateEnum.create;
      for (const item of this.protocols) {
        this.form.patchValue({
          Name: item.Name,
          Username: item.Username,
          Password: item.Password,
          Port: item.Url.toIPPort(),
          Url_: item.Url.toIP(),
          ProtocolType: item.ProtocolType,
        });
        break;
      }
    }
  }

  checkForm(item: FormField) {
    if (item.Name == "") {
      MessageBar.response_warning("名称不能为空");
      return false;
    }
    return true;
  }

  async saveFrom(
    item: FormField,
    successFn: (
      success: boolean,
      item: Platform,
      formState: FormStateEnum
    ) => void
  ) {
    const check = this.checkForm(item);
    var model: Platform;
    model =
      this.editItem && this.formState == FormStateEnum.edit
        ? this.editItem
        : new Platform();
    if (check) {
      model.ProtocolType = item.ProtocolType;
      model.Url = "http://" + item.Url_ + ":" + item.Port;
      model.Username = item.Username;
      model.Password = item.Password;
      model.Name = item.Name;
      model.State = 0;
      if (item.EventRecvIPAddress)
        model.EventRecvIPAddress = item.EventRecvIPAddress;
      if (item.EventRecvPort) model.EventRecvPort = item.EventRecvPort;
      if (item.EventCodes) {
        const eventCodes = new Array<number>(),
          codes = item.EventCodes.split(/[\n,]/g);
        codes.map((x) => {
          if (x.trim()) eventCodes.push(Number.parseInt(x.trim()));
        });
        model.EventCodes = eventCodes;
      }

      model.UpdateTime = new Date().toISOString();
      if (this.formState == FormStateEnum.create) {
        model.Id = "";
        model.CreateTime = new Date().toISOString();

        const response = await this.platformRequestSerivce
          .create(model)
          .toPromise();
        if (response.FaultCode == 0) {
          MessageBar.response_success();
          successFn(true, response.Data, this.formState);
        }
      } else if (this.formState == FormStateEnum.edit) {
        const response = await this.platformRequestSerivce
          .set(model)
          .toPromise();
        if (response.FaultCode == 0) {
          MessageBar.response_success();
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
  EventCodes: string;
}
