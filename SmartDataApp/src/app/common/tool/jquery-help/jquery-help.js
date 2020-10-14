
function moveView(targetDomId, moveDomId, offsetX, offsetY) {
    const target = $('#' + targetDomId), move = $('#' + moveDomId)
    move.css({ 'left': target.offset().left + offsetX + 'px', 'top': target.offset().top + offsetY + 'px' })
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

function domCss(domId, css) {
    $('#' + domId).css(css);
}

function addClass(domId, className) {
    $('#' + domId).addClass(className);
}

function drawRectangle(canvasId, point1, point2, point3, point4) {
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");
 
    ctx.strokeStyle = 'red';
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.moveTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.moveTo(point3.x, point3.y);
    ctx.lineTo(point4.x, point4.y);
    ctx.moveTo(point4.x, point4.y);
    ctx.lineTo(point1.x, point1.y);
    ctx.stroke();
}

exports.moveView = moveView;
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
