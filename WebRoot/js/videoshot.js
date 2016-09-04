// JavaScript Document
var ZhangHongyang = {};  
ZhangHongyang.click2shot = (function ()  
{  
    var _ID_VIDEO = "video";  
    var _ID_SHOTBAR = "shotBar";  
    var _videoWidth = 0;  
    var _videoHeight = 0;  
    var _canvas = null;  
    var _ctx = null;  
    var _video = null;  
  
    function _init()  
    { 
    	localStorage.removeItem("imgInfo");
        _canvas = document.createElement("canvas");  
        _ctx = _canvas.getContext("2d");  
        _video = document.getElementById(_ID_VIDEO);  
  
  
        _video.addEventListener("canplay", function ()  
        {  
            _canvas.width = _videoWidth = _video.videoWidth;  
            _canvas.height = _videoHeight = _video.videoHeight;  
            console.log(_videoWidth + " , " + _videoHeight);  
            _ctx.fillStyle = '#ffffff';  
            _ctx.fillRect(0, 0, _videoWidth, _videoWidth);  
            $("#" + _ID_SHOTBAR).click(_click2shot);  
            _video.removeEventListener("canplay", arguments.callee);  
        });  
  
    }  
  
    function _click2shot(event)  
    {  
        _video.pause();  
        _ctx.drawImage(_video, 0, 0, _videoWidth, _videoHeight, 0, 0, _videoWidth, _videoHeight);  
        var dataUrl = _canvas.toDataURL("image/png");  
  
        //创建一个和video相同位置的图片  
        var $imgBig = $("<img/>");  
  
        $imgBig.width(_videoWidth).height(_videoHeight).css({position: "absolute", left: _video.offsetLeft, top: _video.offsetTop, width: _videoWidth + "px", height: _videoWidth + "px"}).attr("src", dataUrl);  
        $("body").append($imgBig);  
  
        //创建缩略图，准备加到shotBar  
        var $img = $("<img>");  
        $img.attr("src", dataUrl);
        localStorage.setItem("imgInfo",dataUrl);
        $(this).append($img);  
  
        var offset = _getOffset($img[0]);  
        $img.hide();  
        //添加动画效果  
        $imgBig.animate({left: offset.x + "px", top: offset.y + "px", width: $img.width() + "px", height: $img.height() + "px"}, 200, function ()  
        {  
            $img.attr("src", dataUrl).show();  
            $imgBig.remove();  
            _video.play();  
        });  
    }  
  
    /** 
     * 获取元素在显示区域的leftOffset和topOffset 
     * @param elem 
     * @returns {{x: (Number|number), y: (Number|number)}} 
     * @private 
     */  
    function _getOffset(elem)  
    {  
        var pos = {x: elem.offsetLeft, y: elem.offsetTop};  
        var offsetParent = elem.offsetParent;  
        while (offsetParent)  
        {  
            pos.x += offsetParent.offsetLeft;  
            pos.y += offsetParent.offsetTop;  
            offsetParent = offsetParent.offsetParent;  
        }  
        return pos;  
    }  
    return {init: _init}  
})();  