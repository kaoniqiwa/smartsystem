

export  class PicturesDropList{
    id:string;
    checked:boolean;
    content:string;
    constructor(id:string ,content:string){
        this.id=id;
        this.content=content;
        this.checked=false;
    }
}