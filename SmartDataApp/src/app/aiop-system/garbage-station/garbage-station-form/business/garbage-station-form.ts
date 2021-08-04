import { Injectable } from "@angular/core";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { FormGroup, FormControl } from "@angular/forms";
import { FormStateEnum } from "../../../../common/tool/table-form-helper";
import { MessageBar } from "../../../../common/tool/message-bar";
import { DataService } from "../../garbage-station-mgr/business/data.service";
import "../../../../common/string/hw-string";
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
@Injectable()
export class GarbageStationFormService {
  form: FormGroup;
  editItem: GarbageStation;

  formState: FormStateEnum;

  constructor(private dataService: DataService) {
    this.form = new FormGroup({
      Name: new FormControl(""),
      StationType: new FormControl(1),
    });
  }

  async defaultForm(editItem: GarbageStation) {
    if (editItem) {
      this.editItem = editItem;
      this.form.patchValue({
        Name: editItem.Name,
        StationType: editItem.StationType,
      });
      this.formState = FormStateEnum.edit;
    } else {
      this.formState = FormStateEnum.create;
    }
  }

  checkForm(item: FormField) {
    var check = true;
    if (item.Name == "") {
      MessageBar.response_warning("名称不能为空");
      check = false;
    }
    return check;
  }

  async saveFrom(
    item: FormField,
    successFn: (
      success: boolean,
      item: GarbageStation,
      formState: FormStateEnum
    ) => void,
    divisionId?: string
  ) {
    const check = this.checkForm(item);
    var model: GarbageStation;
    model =
      this.editItem && this.formState == FormStateEnum.edit
        ? this.editItem
        : new GarbageStation();
    if (check) {
      model.Name = item.Name;
      model.StationType = item.StationType;
      model.DivisionId = divisionId;
      model.UpdateTime = new Date().toISOString();
      model.CreateTime = new Date().toISOString();
      model.MaxDryVolume = 0;
      model.MaxWetVolume = 0;
      if (this.formState == FormStateEnum.create) {
        model.Id = "";
        const response = await this.dataService.addGarbageStation(model);
        if (!!response) {
          MessageBar.response_success();
          successFn(true, response, this.formState);
        }
      } else if (this.formState == FormStateEnum.edit) {
        const response = await this.dataService.editGarbageStation(model);
        if (!!response) {
          MessageBar.response_success();
          successFn(true, response, this.formState);
        }
      }
    }
  }
}

export class BaseFiled {
  /**平台名称(可选) */
  Name: string;
  /**类型 */
  StationType: number;
}
export class FormField extends BaseFiled {}
