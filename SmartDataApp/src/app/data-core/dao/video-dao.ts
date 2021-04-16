
import { Injectable } from '@angular/core';
import { GetPreviewUrlParams, GetVodUrlParams, VideoUrl } from '../../data-core/model/aiop/video-url';
import { StationResourceSRServersRequestService } from '../repuest/resources.service';
import { SessionUser } from '../../common/tool/session-user';
import { UserDalService } from '../../dal/user/user-dal.service';
import { DateInterval } from "../../common/tool/tool.service";

@Injectable()
export class HWVideoService {
    constructor(private srService: StationResourceSRServersRequestService
        , private userDalService: UserDalService) {

    }
    /**
     * 预览+回放时间
     * @param param 
     * @returns 
     */
    async videoUrl(param: GetPreviewUrlParams|GetVodUrlParams) {
        var result:VideoUrl;
        const videoLive = '4', vu = new VideoUrl()
        , user = new SessionUser()
        ,config = await this.userDalService.getUserConfig(user.id, videoLive);   
        param.StreamType  = config ? parseInt(config):1; 
        param.Protocol = 'ws-ps'; 
        if(param instanceof GetPreviewUrlParams){         
            const response= await this.srService.PreviewUrls(param).toPromise();
            result = response.Data;
        }
        else{
            param.BeginTime = DateInterval(param.BeginTime+'',user.video.beforeInterval)
            param.EndTime= DateInterval(param.EndTime+'',user.video.afterInterval)
            const response= await this.srService.VodUrls(param).toPromise();
            result = response.Data;
        } 
        result.Url = result.Url.indexOf('password') > 0
            ? result.Url : result.Url + user.videoUserPwd;
        vu.Url=    result.Url ;
        vu.Password = result.Password || ''; 
        vu.Username = result.Username || '';;
        vu.WebUrl = result.WebUrl;
        return vu;
    }

    async vodUrl(param: GetVodUrlParams) {
        var result:VideoUrl;
        const videoLive = '4', vu = new VideoUrl()
        , user = new SessionUser()
        ,config = await this.userDalService.getUserConfig(user.id, videoLive);   
        param.StreamType  =  config ? parseInt(config):1; 
        param.Protocol = 'ws-ps'; 
        param.BeginTime =param.BeginTime;
        param.EndTime= param.EndTime;
        const response= await this.srService.VodUrls(param).toPromise();
        result = response.Data;
       
        result.Url = result.Url.indexOf('password') > 0
            ? result.Url : result.Url + user.videoUserPwd;
        vu.Url=    result.Url ;
        vu.Password = result.Password || ''; 
        vu.Username = result.Username || '';
        vu.WebUrl = result.WebUrl;
        return vu;
    }
}