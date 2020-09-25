
function moveView(targetDomId, moveDomId, offsetX, offsetY) {
    const target = $('#' + targetDomId), move = $('#' + moveDomId)
    move.css({ 'left': target.offset().left + offsetX + 'px', 'top': target.offset().top + offsetY + 'px' })
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

function removeClass(domName, className) {
    if (className)
        $(domName).removeClass(className);
    else $(domName).removeClass(domName);
}

function scrollTopPostion(domId, postion) {
    $("#" + domId).scrollTop(postion);
}

function enterKeyDown(fn){
    document.onkeyup = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && (e.keyCode == 13 || e.keyCode == 108)) {
            fn();
        }
      };
}

function domCss(domId,css){
    $('#'+domId).css(css);
}

exports.moveView = moveView;
exports.domClick = domClick;
exports.domClickFn = domClickFn;
exports.inputFileRead = inputFileRead;
exports.scrollTopPostion = scrollTopPostion;
exports.removeClass = removeClass;
exports.enterKeyDown=enterKeyDown;
exports.domCss=domCss;
