export class StateScale{
    title:string;
    stateLabel:{
        subTitle:string;
        scaleNumber:string;
        state:string;
        arc:number;
    }
     
    detail:{
        label:string;
        number:string;
    }[];
    constructor(){
        this.title='';
        this.stateLabel = {
            subTitle :'',
            scaleNumber:'0',
            state:'-',
            arc :0
        }
        this.detail= new Array();
    }
}