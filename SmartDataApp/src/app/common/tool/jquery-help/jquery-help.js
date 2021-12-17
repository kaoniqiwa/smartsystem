
/**
 *  绝对X,Y坐标
 */
function moveView (targetDomId, moveDomId, offsetX, offsetY) {
  const target = $('#' + targetDomId), move = $('#' + moveDomId);
  move.css({ 'left': target.offset().left + offsetX + 'px', 'top': target.offset().top + offsetY + 'px' });
}

/**
 *  相对(父元素)位置:
 */
function moveView2 (targetDomId, moveDomId, offsetX, offsetY) {
  const target = $('#' + targetDomId), move = $('#' + moveDomId);
  move.css({ 'left': target.position().left + offsetX + 'px', 'top': target.position().top + offsetY + 'px' });
}

function moveView3 (targetDomId, offsetX, offsetY) {
  const target = $('#' + targetDomId);
  target.css({ 'left': offsetX + 'px', 'top': offsetY + 'px' });
}

function targetPosition (targetDomId) {
  const target = $('#' + targetDomId)
  return target.position();

}

function domSize (domId) {
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

function domClick (domId) {
  $(domId).click();
}

function domClickFn (domId, fn) {
  $(domId).click(() => {
    if (fn) fn();
  });
}

function inputFileRead (domId, loadFileFn) {
  var file = $(domId)[0].files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      loadFileFn(reader.result.toString());
    }
  }
}

function hasClassName (domId, className) {
  return $('#' + domId).hasClass(className);
}

function removeClass (domId, className) {
  $('#' + domId).removeClass(className);
}

function scrollTopPostion (domId, postion) {
  $("#" + domId).scrollTop(postion);
}

function enterKeyDown (fn) {
  document.onkeyup = (event) => {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && (e.keyCode == 13 || e.keyCode == 108)) {
      fn();
    }
  };
}

function domCss (domId, css, symbol) {
  symbol = symbol ? symbol : '#';
  $(symbol + domId).css(css);
}

function addClass (domId, className) {
  $('#' + domId).addClass(className);
}

function drawRectangle (canvas, objects, size, color = "red", text = "") {
  let c;
  if (typeof (canvas) === "string") {
    c = document.getElementById(canvas)
  }
  else {
    c = canvas
  }
  var ctx = c.getContext("2d");

  ctx.fillStyle = "red";
  ctx.font = "18px Source Han Sans CN Normal";

  ctx.strokeStyle = color;
  ctx.beginPath();

  for (let i = 0; i < objects.length; i++) {
    const points = objects[i];
    ctx.fillText(text, points[0].X * size.width, points[0].Y * size.height)
    ctx.moveTo(points[0].X * size.width, points[0].Y * size.height)
    for (let j = 0; j < points.length; j++) {
      const point = points[j];
      ctx.lineTo(point.X * size.width, point.Y * size.height)
    }
    ctx.lineTo(points[0].X * size.width, points[0].Y * size.height)
  }

  ctx.closePath();
  ctx.stroke();

  return c
}

function clearCanvas (canvasId) {
  var c = document.getElementById(canvasId);
  var cxt = c.getContext("2d");
  cxt.clearRect(0, 0, c.width, c.height);
}

function createVideo (forId, src, parentDomId) {
  var _video = document.createElement("video");
  _video.id = forId;
  _video.muted = true; // this is important to the policy
  _video.src = src;
  _video.autoplay = true;
  _video.loop = true;
  _video.setAttribute('playsinline', '');
  document.getElementById(parentDomId).appendChild(_video);
}

function downloadFile (filename, text) {
  download(text, filename, "text/plain");
}

function launchIntoFullscreen (id) {
  var element = document.getElementById(id);
  if (element.requestFullscreen) {
    element.requestFullscreen();
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
  else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function setData (dom, name, val) {
  $('#' + dom).data(name, val);
}

function getData (dom, name) {
  return $('#' + dom).data(name);
}

function getCanvasDataUrl (domId) {
  const canvas = $('#' + domId).find('canvas'),
    imgUrl = canvas[0].toDataURL('image/png');
  return imgUrl || null
}

function mousewheel (dom, cb) {
  $(dom).on("mousewheel DOMMouseScroll", function (event) {
    cb(this, event);
  });
}

function scrollLeft (dom, leftNumber) {
  var a = $(dom).parent();
  $(a[0]).scrollLeft(leftNumber);
}

function tooltip () {
  $('[data-toggle="tooltip"]').tooltip();
}

exports.getData = getData;
exports.setData = setData;
exports.moveView = moveView;
exports.moveView2 = moveView2;
exports.moveView3 = moveView3;
exports.targetPosition = targetPosition;
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
exports.createVideo = createVideo;
exports.downloadFile = downloadFile;
exports.launchIntoFullscreen = launchIntoFullscreen;
exports.exitFullscreen = exitFullscreen;
exports.getCanvasDataUrl = getCanvasDataUrl;
exports.mousewheel = mousewheel;
exports.scrollLeft = scrollLeft;
exports.tooltip = tooltip;
