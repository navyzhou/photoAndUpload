$(function(){
	var options ={thumbBox : '.thumbBox',spinner : '.spinner',imgSrc : 'images/head.jpg'}
	var cropper = $('.imageBox').cropbox(options);
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

function uploadHead() {
	var pic = $("#headinfo2").attr("src");
	pic = pic.replace(/^data:image\/(png|jpg);base64,/, "");

	$.ajaxFileUpload({
		url:'uploadServlet',
		//fileElementId:'canvas',
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