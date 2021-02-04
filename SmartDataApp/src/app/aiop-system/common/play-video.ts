import { SessionUser } from "../../common/tool/session-user";

export class PlayVideo {
    url: string;
    name: string;
    constructor(url: string,
        name: string) {
        this.url = '';
        this.name = name;
    }
    set url_(val: string) {
        const user = new SessionUser();
        if (val.indexOf('password') < 0)
            this.url += val + user.videoUserPwd;
    }
}