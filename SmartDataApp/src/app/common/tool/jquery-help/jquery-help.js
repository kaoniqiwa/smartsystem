
/**
 *  绝对X,Y坐标
 */
function moveView(targetDomId, moveDomId, offsetX, offsetY) {
    const target = $('#' + targetDomId), move = $('#' + moveDomId)
    move.css({ 'left': target.offset().left + offsetX + 'px', 'top': target.offset().top + offsetY + 'px' })
}

/**
 *  相对(父元素)位置:
 */
function moveView2(targetDomId, moveDomId, offsetX, offsetY) {
    const target = $('#' + targetDomId), move = $('#' + moveDomId)
    move.css({ 'left': target.position().left + offsetX + 'px', 'top': target.position().top + offsetY + 'px' })
}

function domSize(domId) {
    const dom = $('#' + domId);
    if (dom.offsetWidth) {
        return {
            width: dom.offsetWidth
            , height: dom.offsetHeight
        }
    }
    return {
        width: dom[0].offsetWidth
        , height: dom[0].offsetHeight
    }
}

function domClick(domId) {
    $(domId).click();
}

function domClickFn(domId, fn) {
    $(domId).click(() => {
        if (fn) fn();
    });
}

function inputFileRead(domId, loadFileFn) {
    var file = $(domId)[0].files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            loadFileFn(reader.result.toString());
        }
    }
}

function hasClassName(domId, className) {
    return $('#' + domId).hasClass(className);
}

function removeClass(domId, className) {
    $('#' + domId).removeClass(className);
}

function scrollTopPostion(domId, postion) {
    $("#" + domId).scrollTop(postion);
}

function enterKeyDown(fn) {
    document.onkeyup = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && (e.keyCode == 13 || e.keyCode == 108)) {
            fn();
        }
    };
}

function domCss(domId, css, symbol) {
    symbol = symbol ? symbol : '#';
    $(symbol + domId).css(css);
}

function addClass(domId, className) {
    $('#' + domId).addClass(className);
}

function drawRectangle(canvasId, points, size) {
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");

    ctx.fillStyle = "red";
    ctx.font = "18px Source Han Sans CN Normal";

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    for (const a of points) {
        ctx.fillText(a.Id + ' ' + a.Confidence + '%', a.Polygon[0].X * size.width, a.Polygon[0].Y * size.height);
        ctx.moveTo(a.Polygon[0].X * size.width, a.Polygon[0].Y * size.height);
        ctx.lineTo(a.Polygon[1].X * size.width, a.Polygon[1].Y * size.height);
        ctx.moveTo(a.Polygon[1].X * size.width, a.Polygon[1].Y * size.height);
        ctx.lineTo(a.Polygon[2].X * size.width, a.Polygon[2].Y * size.height);
        ctx.moveTo(a.Polygon[2].X * size.width, a.Polygon[2].Y * size.height);
        ctx.lineTo(a.Polygon[3].X * size.width, a.Polygon[3].Y * size.height);
        ctx.moveTo(a.Polygon[3].X * size.width, a.Polygon[3].Y * size.height);
        ctx.lineTo(a.Polygon[0].X * size.width, a.Polygon[0].Y * size.height);
    }


    ctx.closePath();
    ctx.stroke();
}

function clearCanvas(canvasId) {
    var c = document.getElementById(canvasId);
    var cxt = c.getContext("2d");
    cxt.clearRect(0, 0, c.width, c.height);
}

function createVideo(forId,src,parentDomId){
    var _video = document.createElement("video");
    _video.id = forId;
    _video.muted = true; // this is important to the policy
    _video.src = src;
    _video.autoplay = true;
    _video.loop = true; 
    _video.setAttribute('playsinline', '');  
    document.getElementById(parentDomId).appendChild(_video);
}

function downloadFile(filename, text) {
    download(text, filename, "text/plain");
}

exports.moveView = moveView;
exports.moveView2 = moveView2;
exports.domClick = domClick;
exports.domClickFn = domClickFn;
exports.inputFileRead = inputFileRead;
exports.scrollTopPostion = scrollTopPostion;
exports.removeClass = removeClass;
exports.enterKeyDown = enterKeyDown;
exports.domCss = domCss;
exports.addClass = addClass;
exports.hasClassName = hasClassName;
exports.drawRectangle = drawRectangle;
exports.domSize = domSize;
exports.clearCanvas = clearCanvas;
exports.createVideo=createVideo;
exports.downloadFile=downloadFile;
