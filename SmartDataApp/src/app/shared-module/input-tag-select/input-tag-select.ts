export class InputTagSelect{
    id:string;
    text:string;
    checked:boolean; 
    hide = false; 
    constructor(id:string,text:string,checked:boolean){
        this.id=id;
        this.text=text;
        this.checked=checked; 
    }
}