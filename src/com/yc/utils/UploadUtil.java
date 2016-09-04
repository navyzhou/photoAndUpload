package com.yc.utils;


import java.io.IOException;
import java.sql.SQLException;
import java.util.Collection;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.jsp.PageContext;

import com.jspsmart.upload.File;
import com.jspsmart.upload.Files;
import com.jspsmart.upload.Request;
import com.jspsmart.upload.SmartUpload;
import com.jspsmart.upload.SmartUploadException;

/**
 * 文件上传的类
 * @author navy
 */
public class UploadUtil {
	private static final String PATH="../dataInfo"; //保存图片的路径
	private static final String ALLOWED="gif,jpg,png,jpeg"; //允许上传的文件格式
	private static final String DENIED="exe,bat,jsp,html,com"; //不可以上传的文件格式
	private static final int TOTALMAXSIZE=20*1024*1024; //总文件大小
	private static final int SINGLEFILESIZE=1024*1024; //单个文件大小

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Map<String,String> update(PageContext context) throws SmartUploadException, IOException, ServletException, SQLException{
		Map<String,String> params=new HashMap<String,String>();

		SmartUpload su=new SmartUpload();
		su.initialize(context); //初始化

		//设置参数
		su.setMaxFileSize(SINGLEFILESIZE);
		su.setTotalMaxFileSize(TOTALMAXSIZE);
		su.setAllowedFilesList(ALLOWED);
		su.setDeniedFilesList(DENIED);
		su.setCharset("utf-8");

		su.upload(); //开始上传

		//获取请求中的信息
		Request request=su.getRequest();

		Enumeration  et=request.getParameterNames();
		String str;

		while(et.hasMoreElements()){ //请求中的普通表单元素信息
			str=String.valueOf(et.nextElement());
			params.put(str,request.getParameter(str));
		}

		Files fls=su.getFiles();
		String fileName; //文件名
		String picPath="";
		if(fls!=null && fls.getCount()>0){ //说明有文件
			Collection<File> cols=fls.getCollection();
			for(File fl:cols){
				if( !fl.isMissing() ){ //判断上传的文件有没有丢失数据
					fileName=PATH+"/"+new Date().getTime()+""+new Random().nextInt(100000)+"."+fl.getFileExt(); //获取扩展名

					//将图片写入服务器
					fl.saveAs(fileName,SmartUpload.SAVE_VIRTUAL);
					picPath+=fileName+",";
				}
			}
			picPath=picPath.substring(0,picPath.lastIndexOf(","));
			params.put("photo",picPath); //往数据库存的图片路径信息
		}
		return params;
	}
}
