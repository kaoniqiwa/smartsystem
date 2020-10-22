export class ImageDesc {
    imgSrc: string;
    id:string;
    leftDesc: string[];
    rightDesc: string[];
    selected :boolean;
    constructor(id:string,
        imgSrc: string,
        leftDesc: string[],
        rightDesc: string[]) {
            this.id=id;
        this.imgSrc = imgSrc;
        this.leftDesc = leftDesc;
        this.rightDesc = rightDesc;
        this.selected=false;
    }
}