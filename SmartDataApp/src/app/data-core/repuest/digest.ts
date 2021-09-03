import { Md5 } from "ts-md5/dist/md5";
import { HttpHeaders } from "@angular/common/http";

export class Digest {
  private header: string;
  constructor(header?: Headers, realm?: string) {
    if (header) {
      // WWW-Authenticate 服务器响应头，表示请求需要获得验证
      this.header =
        "WWW-Authenticate: " +
        header.get("WWW-Authenticate").replace('realm=""', `realm="${realm}"`);
      sessionStorage.setItem("WWW-Authenticate", this.header);
    } else {
      this.header = sessionStorage.getItem("WWW-Authenticate");
    }
  }
  buildField(name, value) {
    return value ? name + '="' + value + '", ' : "";
  }

  // 将响应字符串转换为对象形式
  parseServerChallenge() {
    if (!this.header) {
      return {};
    }
    var splitting = this.header.split(", ");
    let challenge = {};

    if (!splitting.length) {
      return challenge;
    }

    for (var i = 0; i < splitting.length; i++) {
      var values = /([a-zA-Z]+)=\"?([a-zA-Z0-9.@\/\s]+)\"?/.exec(splitting[i]);
      challenge[values[1]] = values[2];
    }

    return challenge;
  }
  generateRequestHeader(_nc, challenge, username, password, method, uri) {
    // nonce计数器,格式为十六进制数值[1,ffffffff],nc="00000001",在 nonce不变的情况下，重复请求,nc+1
    var nc = ("00000000" + _nc).slice(-8);

    /* Calculate cnonce */
    /* Math.randon().toString(36) -> "0.9g7hgvo99dj".slice(2) -> "9g7hgvo99dj" */

    // 客户端随机数,长度不一定位8为，参与客户端和服务端摘要生成
    var cnonce = ("00000000" + Math.random().toString(36).slice(2)).slice(-8);

    /* 
            生成摘要:
            ha1 = md5(username:realm:password);
            ha2 = md5(method:uri)
            response = md5(ha1:nonce:nc:cnonce:qop:ha2)
        */
    var ha1 = Md5.hashStr([username, challenge.realm, password].join(":"));
    var ha2 = Md5.hashStr([method, uri].join(":"));
    var response = Md5.hashStr(
      [ha1, challenge.nonce, nc, cnonce, challenge.qop, ha2].join(":")
    );

    let authHeader = (
      "Digest " +
      this.buildField("username", username) +
      this.buildField("realm", challenge.realm) +
      this.buildField("nonce", challenge.nonce) +
      this.buildField("uri", uri) +
      this.buildField("algorithm", challenge.algorithm) +
      this.buildField("response", response) +
      this.buildField("opaque", challenge.opaque) +
      this.buildField("qop", challenge.qop) +
      this.buildField("nc", nc) +
      this.buildField("cnonce", cnonce)
    ).slice(0, -2);
    /**
     * 服务器返回 403,所以不会弹窗提示输入用户名和密码
     * 如果是弹窗提示，则浏览器自动构造出Authorization字段值
     */
    return new HttpHeaders({
      Authorization: authHeader,
      "X-WebBrowser-Authentication": "Forbidden",
    });
  }
}
