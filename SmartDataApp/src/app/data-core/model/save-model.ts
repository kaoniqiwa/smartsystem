import { ClassConstructor, plainToClass } from "class-transformer";
import { isArray, isObject } from "util";
import { FormMustField } from "../model/must-field";
import { PagedList } from "./page";
import { HowellResponse } from "./response";
export class SaveModel {
  static formMustField = new FormMustField();
  static toModel<T>(model: T, mustField: string[]) {
    var saveObj = new Object();
    const serialization = (obj: any) => {
      var newObj = new Object();
      if (isObject(obj)) {
        Object.keys(obj).forEach(function (key) {
          if (obj[key] != null && obj[key] != "null" && obj[key] != "") {
            newObj[key] = obj[key];
          }
          if (obj[key] == 0) newObj[key] = obj[key];
        });
      } else if (isArray(obj)) {
      }
      return newObj;
    };
    Object.keys(model).forEach(function (key) {
      var index = mustField.findIndex((x) => {
        return x == key;
      });
      if (index >= 0) {
        saveObj[key] = model[key];
      } else {
        if (isArray(model[key])) {
          saveObj[key] = new Array();
          for (let i = 0; i < model[key].length; i++) {
            const arrM = model[key][i];
            saveObj[key].push(serialization(arrM));
          }
        } else if (isObject(model[key])) {
          saveObj[key] = serialization(model[key]);
        } else {
          if (model[key] != null && model[key] != "" && model[key] != "null") {
            saveObj[key] = model[key];
          }
          if (model[key] == 0) saveObj[key] = model[key];
        }
      }
    });

    return saveObj as T;
  }
}

export class RequestServiceProcessor {
  static ResponseProcess<T>(
    response: HowellResponse<T>,
    t: ClassConstructor<T>
  );
  static ResponseProcess<T>(
    response: HowellResponse<PagedList<T>>,
    t: ClassConstructor<T>
  );
  static ResponseProcess<T>(
    response: HowellResponse<T | PagedList<T>>,
    t: ClassConstructor<T>
  ) {
    if (response.FaultCode != 0) {
      console.error(response.FaultReason, response.InnerException);
      throw new Error(response.FaultReason);
    }
    if (response.Data instanceof PagedList) {
      let result = response.Data;
      result.Data = plainToClass(t, response.Data) as unknown as T[];
      return result;
    } else {
      return plainToClass(t, response.Data);
    }
  }
}
