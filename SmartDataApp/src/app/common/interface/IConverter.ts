import { IBusinessData } from "./IBusiness";
import { IViewModel } from "../abstract/base-view";
export interface IConverter {
  Convert(input: IBusinessData, output: IViewModel): IViewModel;
}
