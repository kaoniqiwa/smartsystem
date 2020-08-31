export class InputTagArea{
    id:string;
    text:string;
    checked:boolean;
    del:boolean;
    hide = false;
    /**
     * 1 上面
     * 2 下面
     */
    type: number;
    constructor(id:string,text:string,checked:boolean,type:number){
        this.id=id;
        this.text=text;
        this.checked=checked;
        this.type=type;
        this.del = false;
    }
} 