
import { IBusinessData} from './IBusiness';
import { IViewModel } from '../abstract/base-view';
export interface IConverter {
    Convert<T extends IBusinessData,R extends IViewModel>(input: T,output: R): R;
}