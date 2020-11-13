/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */
 
declare global {
    export interface String {
        naturalCompare(a,b):any;
        validIP():boolean;
        validIPPort():boolean;
        toIP():string;
        toIPPort():string; 
        dateTimePickerZC():string;
    }
}
export default String; 