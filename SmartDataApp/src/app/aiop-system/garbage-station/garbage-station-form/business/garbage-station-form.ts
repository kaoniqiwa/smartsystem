import { Injectable } from "@angular/core";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { FormGroup, FormControl } from "@angular/forms";
import { FormStateEnum } from "../../../../common/tool/table-form-helper";
import { MessageBar } from "../../../../common/tool/message-bar";
import { DataService } from "../../garbage-station-mgr/business/data.service";
import "../../../../common/string/hw-string";
<<<<<<< HEAD

=======
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
import { DateTime } from "src/app/data-core/model/date-time";
>>>>>>> c569db68c90a18169ce619cfbceded4620335126
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
<<<<<<< HEAD
      model.UpdateTime = new Date();
      model.CreateTime = new Date();
=======
      model.UpdateTime = new DateTime();
      model.CreateTime = new DateTime();
>>>>>>> c569db68c90a18169ce619cfbceded4620335126
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
