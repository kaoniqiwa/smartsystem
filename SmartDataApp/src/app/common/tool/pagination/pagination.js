function HWPagination(domId,total,changeFn){
    var box = new CustomPagination(domId, {
        total: total,//总页数
        changePage: function (pageNum) {//切换页码成功回调
            changeFn(pageNum)
        }
      });
}

exports.HWPagination = HWPagination; 