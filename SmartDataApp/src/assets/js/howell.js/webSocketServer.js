/// <reference path="howell.js" />
/// <reference path="../jquery/jquery-1.10.2.min.js" />

function WebSocketServer(uri) {
    /// <signature>
    /// <summary>WebSocket服务</summary>
    /// <param name='uri' type='String' >服务地址</param>
    /// <field name='Uri' type='String'>服务地址</field>
    /// <field name='Opened' type='Bool'>服务是否已经开启 true:开启;false:未开启</field>

    /// <field name='OnOpen' type='Event'>服务开启事件</field>
    /// <field name='OnClose' type='Event'>服务关闭事件</field>
    /// <field name='OnMessage' type='Event'>服务传递消息事件</field>
    /// <field name='OnError' type='Event'>服务异常事件</field>
    /// <field name='Close' type='Function'>关闭服务</field>
    /// <field name='Open' type='Function'>打开服务</field>
    /// <field name='Send' type='Function'>传递消息</field>
    /// </signature>

    this.Uri = uri;
    var entity = this;
    var websocket = null;

    


    this.Opened = false;

    this.OnOpen = null;
    this.OnClose = null;

    this.OnError = null;
    this.OnMessage = null;

    this.Close = function () {
        websocket.close();
        this.Opened = false;
    }

    this.Send = function (message) {
        if (websocket.readyState == websocket.CONNECTING) {
            setTimeout(entity.Send, 1000, message)
            return;
        }
        if (entity.Opened)
            websocket.send(message);
    }

    this.Open = function (uri) {
        if (this.Opened) {
            websocket.close();
            websocket = null;
        }
        if (uri)
            this.Uri = uri;        
        websocket = createWebSocket();
    }
    

    var createWebSocket = function () {
        var ws = new WebSocket(entity.Uri);        
        ws.onopen = function (e) {
            if (entity.OnOpen)
                entity.OnOpen(e);
            
            entity.Opened = true;
        };
        ws.onclose = function (e) {
            if (entity.OnClose)
                entity.OnClose(e);
        };
        ws.onmessage = function (e) {
            if (entity.OnMessage)
                entity.OnMessage(e);
        };
        ws.onerror = function (e) {
            if (entity.OnError)
                entity.OnError(e);
        };
        return ws;
    }
}

function WebSocketRequest() {
    this.Message = 0;
    this.CSeq = 0;
    this.Request = new Object();
}
function WebSocketResponse() {
    this.Message = 0;
    this.CSeq = 0;
    this.Response = new Object();
}