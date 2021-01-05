export class ImageDesc {
    imgSrc: string;
    imgName:string;
    id:string;
    leftDesc: string[];
    rightDesc: string[];
    selected :boolean;
    constructor(id:string,
        imgSrc: string,
        leftDesc: string[],
        rightDesc: string[],
        imgName:string) {
            this.id=id;
        this.imgSrc = imgSrc;
        this.leftDesc = leftDesc;
        this.rightDesc = rightDesc;
        this.selected=false;
        this.imgName=imgName;
    }
}