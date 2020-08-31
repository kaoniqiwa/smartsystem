
function moveView(targetDomId,moveDomId,offsetX,offsetY){
    const target = $('#'+targetDomId),move = $('#'+moveDomId)
    move.css({'left':target.offset().left + offsetX +'px', 'top': target.offset().top + offsetY + 'px'})
}

function domClick(domId){
    $(domId).click();
}

function domClickFn(domId,fn){
    $(domId).click(()=>{
         if(fn)fn();
    });
}

function inputFileRead(domId,loadFileFn){
    var file = $(domId)[0].files[0];
    if(file){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=>{
            loadFileFn(reader.result.toString());
        }
    }
}

function scrollTopPostion(domId,postion){
    $("#"+domId).scrollTop(postion);
}


exports.moveView = moveView; 
exports.domClick=domClick;
exports.domClickFn=domClickFn;
exports.inputFileRead=inputFileRead;
exports.scrollTopPostion=scrollTopPostion;
