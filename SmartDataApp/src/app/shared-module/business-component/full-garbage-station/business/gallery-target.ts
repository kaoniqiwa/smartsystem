import { MediumPicture } from "../../../../data-core/url/aiop/resources";
import { GalleryTarget, ImageEventEnum } from "../../../gallery-target/gallery-target";
import { GalleryTargetView } from "../../event-history/gallery-target";
import { Camera } from "../../../../data-core/model/aiop/camera";
import { Camera  as ResourceCamera} from "../../../../data-core/model/waste-regulation/camera";
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



    initGalleryTargetI(garbageId:string,cameras: Camera[]) {
        if (cameras && cameras.length) {
            const enlargeImage = new MediumPicture().getJPG(cameras[0].ImageUrl),ids = new Array();
            cameras.map(x=>ids.push(x.Id));
            this.galleryTarget = new GalleryTarget(null
                , null, enlargeImage,
                null, garbageId +'&'+cameras[0].Id, this.toDownLoadImgNameI(cameras[0]));
            this.galleryTarget.imgNext = cameras.length > 1;
            this.galleryTarget.imgPrev = false;
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