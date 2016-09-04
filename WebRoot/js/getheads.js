var cropper=null;
var options=null;

$(function(){
	options ={thumbBox : '.thumbBox',spinner : '.spinner',imgSrc : 'images/head.jpg'};
	cropper = $('.imageBox').cropbox(options);
	$('#upload-file').on('change', function() {
		var reader = new FileReader();
		reader.onload = function(e) {
			options.imgSrc = e.target.result;
			cropper = $('.imageBox').cropbox(options);
		}
		reader.readAsDataURL(this.files[0]);
		this.files = [];
	});
	
	$('#btnCrop').on('click',function() {
		var img = cropper.getDataURL();
		$('.cropped').html('');
		$('.cropped').append('<img id="headinfo1" src="'+img+'" align="absmiddle" style="width:64px;margin-top:4px;border-radius:64px;box-shadow:0px 0px 12px #7E7E7E;" ><p>64px*64px</p>');
		$('.cropped').append('<img id="headinfo2" src="'+img+'" align="absmiddle" style="width:128px;margin-top:4px;border-radius:128px;box-shadow:0px 0px 12px #7E7E7E;"><p>128px*128px</p>');
		$('.cropped').append('<img id="headinfo3" src="'+img+'" align="absmiddle" style="width:180px;margin-top:4px;border-radius:180px;box-shadow:0px 0px 12px #7E7E7E;"><p>180px*180px</p>');
	});

	$('#btnZoomIn').on('click', function() {
		cropper.zoomIn();
	});
	
	$('#btnZoomOut').on('click', function() {
		cropper.zoomOut();
	});
});

function init(t) {
	accessLocalWebCam("navy_video");
}

window.URL = window.URL || window.webkitURL || window.msURL || window.oURL;
navigator.getUserMedia = navigator.getUserMedia|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia|| navigator.msGetUserMedia;

function isChromiumVersionLower() {
	var ua = navigator.userAgent;
	var testChromium = ua.match(/AppleWebKit\/.* Chrome\/([\d.]+).* Safari\//);
	return (testChromium && (parseInt(testChromium[1].split('.')[0]) < 19));
}

function successsCallback(stream) {
	document.getElementById('camera_errbox').style.display = 'none';
	document.getElementById('navy_video').src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream): stream;

}

function errorCallback(err) {

}

var context=null;
var video=null;
var videoWidth = 0;  
var videoHeight = 0;  

function accessLocalWebCam(id) {
	try {
		navigator.getUserMedia({
			video : true
		}, successsCallback, errorCallback);
	} catch (err) {
		navigator.getUserMedia('video', successsCallback, errorCallback);
	}
}

window.addEventListener("DOMContentLoaded", function() {
	var canvas = document.createElement("canvas"),
	context = canvas.getContext("2d"),
	video = document.getElementById("navy_video"),
	videoObj = {
		"video" : true
	}, errBack = function(error) {
		console.log("相机调用失败...", error.code);
	};
	
	video.addEventListener("canplay", function () {  
        canvas.width = videoWidth =$("#imageBox").width();  
        canvas.height = videoHeight = $("#imageBox").height();  
        console.log(videoWidth + " , " + videoHeight);  
        context.fillStyle = '#ffffff';  
        context.fillRect(0, 0, videoWidth, videoWidth);  
        video.removeEventListener("canplay", arguments.callee);  
	 });  

	if (navigator.getUserMedia) {
		navigator.getUserMedia(videoObj, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if (navigator.webkitGetUserMedia) {
		navigator.webkitGetUserMedia(videoObj, function(stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	
	document.getElementById("snap").addEventListener("click", function() {
		context.drawImage(video, 0, 0,$("#imageBox").width(), $("#imageBox").height());
		var dataUrl = canvas.toDataURL("image/png");
		$("#imageBox").css("background-image","url("+dataUrl+")");
		options.imgSrc=dataUrl;
		cropper = $('#imageBox').cropbox(options);
	});
}, false);

function uploadHead() {
	var pic = $("#headinfo2").attr("src");
	pic = pic.replace(/^data:image\/(png|jpg);base64,/, "");

	$.ajaxFileUpload({
		url:'uploadServlet',
		data:{imageData:pic},
		dataType:'json',
		success:function(data,status){
			data=parseInt( $.trim(data));
			if(data==1){
				alert("图片上传成功...");
			}else{
				alert("图片上传失败...");
			}
		},
		error:function(data,status,e){
			alert("图片上传失败...");
		}
	});
}