import { MediumPicture } from "../../../../data-core/url/aiop/resources";
import { GalleryTarget, ImageEventEnum } from "../../../gallery-target/gallery-target";
import { GalleryTargetView } from "../../event-history/gallery-target";
import { Camera } from "../../../../data-core/model/aiop/camera"; 
export class GalleryTargetViewI extends GalleryTargetView {

    neighborEventFnI: (id: string, e: ImageEventEnum) => {
        prev: boolean,
        next: boolean,
        item: Camera
    };

    showImagePageI(id: string, e: ImageEventEnum) {
        const event = this.neighborEventFnI(id, e);
        return {
            prev: {
                show: event.prev,
                item: event.item
            },
            next: {
                show: event.next,
                item: event.item
            }
        }
    }

    galleryTargetPageFn = (e: ImageEventEnum, id: string) => { 
        const page = this.showImagePageI(id, e),idV = id.split('&');
       
        if (e == ImageEventEnum.next && page.next.item) {
            const enlargeImage = new MediumPicture().getJPG(page.next.item.ImageUrl);
            this.galleryTarget = new GalleryTarget(null
                , null, enlargeImage, null
                , idV[0]+'&'+page.next.item.Id, this.toDownLoadImgNameI(page.next.item));

        }
        else if (e == ImageEventEnum.prev && page.prev.item) {
            const enlargeImage = new MediumPicture().getJPG(page.prev.item.ImageUrl);
            this.galleryTarget = new GalleryTarget(null
                , null, enlargeImage, null
                , idV[0]+'&'+page.prev.item.Id, this.toDownLoadImgNameI(page.prev.item));
        }

        this.galleryTarget.imgNext = page.next.show;
        this.galleryTarget.imgPrev = page.prev.show;
    }



    initGalleryTargetI(garbageId:string,cameras: Camera[],index:number) { 
        if (cameras && cameras.length) {
            const enlargeImage = new MediumPicture().getJPG(cameras[index].ImageUrl),ids = new Array();
            cameras.map(x=>ids.push(x.Id));
            this.galleryTarget = new GalleryTarget(null
                , null, enlargeImage,
                null, garbageId +'&'+cameras[index].Id, this.toDownLoadImgNameI(cameras[index]));
            this.galleryTarget.imgNext = (index+1)< cameras.length;
            this.galleryTarget.imgPrev = index > 0;
        }

    }


    toDownLoadImgNameI(item: Camera) {
        var name = '';
        name += item.Name + ' ';
        name += this.datePipe.transform(item.UpdateTime, 'yyyy年MM月dd日 hh点mm分') + ' ';
        return name;
    }
    enlargeImageSize = {
        width: 0,
        height: 0
    }
}