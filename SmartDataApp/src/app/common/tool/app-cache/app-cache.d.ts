 /**
 * Developer 施文斌
 * LastUpdateTime  
 */
export declare class AppCaChe { 
    constructor(maxAge:number);
    get<T>(key: string):T;
    set<T>(key: string, value: T):void;
}
 