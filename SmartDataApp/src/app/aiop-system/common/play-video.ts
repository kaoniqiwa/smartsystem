import { SessionUser } from "../../common/tool/session-user";

export class PlayVideo {
    WebUrl: string;
    url: string;
    name: string;
    constructor(webUrl: string, url: string, name: string) {
        this.WebUrl = webUrl;
        this.url = '';
        this.name = name;
    }
    set url_(val: string) {
        this.url = val;
        const user = new SessionUser();
        if (val.indexOf('password') < 0)
            this.url += val + user.videoUserPwd;
    }
}