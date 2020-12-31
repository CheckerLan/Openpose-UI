
$(document).ready(function () {

    
 
    function addListItem(i,type) {
        $("#listul"+type).append(
            "<div class=\"listItem\"> <p value=" + i + " onclick=\"set"+type+"Img(this)\">"
            + i + "</p> <a class=\"dela\"  >删除</a> </div>");//内层循环追加li onclick=\"delImg(this)\"
        
    }
    
    function getulList() { 
        var url;
        if ($("#startBtn").attr("video") == "false") {
            url = 'http://localhost:8080/list?src=images';
        } else { 
            url = 'http://localhost:8080/list?src=video';
        }
        
        
        $.ajax({
            url:url,
            dataType: 'json',
           // dataType:"application/x-www-form-urlencoded",
            type: "get",
            cache: false,
            // sync: false, 
            success: function (data) {
                
                $("#listul").empty();
                console.log(data);
                for (var i of data) {
                    addListItem(i, "");
                }
            },
            error: function (response) {
                console.log("err")
                console.log(response);
            }
        });
    }

    function getulListout() { 
        var url;
        if ($("#startBtn").attr("video") == "false") {
            url = 'http://localhost:8080/list?src=images%2Fout%2F';
        } else { 
            url = 'http://localhost:8080/list?src=video%2Fout%2F';
        }
        
        $.ajax({
            url:url,
            dataType: 'json',
           // dataType:"application/x-www-form-urlencoded",
            type: "get",
            cache: false,
            // async: false, 
            success: function (data) {
                $("#outputimage").attr("src", '');
                $("#previewout")
                $("#listulout").empty();
                console.log(data);
                for (var i of data) {
                    addListItem(i, "out");
                }
            },
            error: function (response) {
                console.log("err")
                console.log(response);
            }
        });
    }
    


    $("#runing").css('display', 'none');
    $("#loading").css('display', 'none');
    getulList();
    getulListout();
    
    $('#content').change(function () {
        
        if ($("#content").val() == "images") {
            
                
            $("#startBtn").attr("video", "false");
            $("#preview").css('display', 'none');
            $("#previewout").css('display', 'none');
            $("#inputimage").css('display', 'block');
            $("#outputimage").css('display', 'block');
            getulList();
            getulListout();
        } else { 

            $("#startBtn").attr("video", "true");
            $("#preview").empty();
            $("#preview").css('display', 'block');
            $("#previewout").css('display', 'block');
            $("#inputimage").css('display', 'none');
            $("#outputimage").css('display', 'none');
            getulList();
            getulListout();

        }
    });
    

        
    $("#inputfile").change(function () {
            
        var file = this.files[0];
        // console.log("get")
        // console.log(file)
        var video;
        if (file.type.indexOf("image") != -1) {
            video = false;
            console.log("切换至图片模式")
            if ($("#startBtn").attr("video") == "true") { 
                alert("切换至图片模式");
                
                $("#content").val("images");
                $("#startBtn").attr("video", "false");
                $("#preview").css('display', 'none');
                $("#previewout").css('display', 'none');
                $("#inputimage").css('display', 'block');
                $("#outputimage").css('display', 'block');
                getulList();
                getulListout();
            }
        } else if (file.type.indexOf("video") != -1) {

            video = true;
            console.log("切换至视频模式"+$("#startBtn").attr("video"))
            if ($("#startBtn").attr("video") == "false") { 
                alert("切换至视频模式");
                $("#content").val("video");
                $("#startBtn").attr("video", "true");
                $("#preview").empty();
                $("#preview").css('display', 'block');
                $("#previewout").css('display', 'block');
                $("#inputimage").css('display', 'none');
                $("#outputimage").css('display', 'none');
                getulList();
                getulListout();
            }
            
        }else { 
            alert("上传文件非图片也非视频！");
            return;
        }
        // else if (file.type.indexOf("video") != -1) {
        //     $("#inputimage").css('display','none');
        //     // $("#inputvideo").css('display','block');
        // }
        //alert("开始上传图片，请耐心等待；");
        $("#loading").css('display', 'block');
        var isvideo;
        if ($("#startBtn").attr("video") == "false") {
            isvideo = false;
        } else { 
            isvideo = true;
        }
        
        var formData = new FormData();
        formData.append("input", file);
        formData.append("isvideo", isvideo);
        $.ajax({
            url:'http://localhost:8080/updateImg',
            // dataType: 'json',
            dataType:"text",
            type:"post",
            data: formData,
            cache: false,
            // async: false, 
            processData : false, // 使数据不做处理
            contentType : false, // 不要设置Content-Type请求头
            success: function (data) {
                console.log(data);
                // alert(data);
                $("#loading").css('display', 'none');
                alert("上传完成！");
                getulList();
            },
            error: function (response) {
                console.log("err")
                console.log(response);

            }
        });


        if (window.FileReader) {    
            var reader = new FileReader();    
            reader.readAsDataURL(file);    
            //监听文件读取结束后事件    
            reader.onloadend = function (e) {
                if (video) {
                    $("#preview").empty();
                    // $("#preview").append("<video class=\"inputvideo\"   controls='' autoplay='' name='media'><source src="+ reader.result+" type='video/avi'></video>");
                    // $("#preview").append(
                    //     "<object type=\"video / x - msvideo\" data=\"video.avi\"  width=\"320\" height=\"240\">" +
                    //     "<param name=\"src\" value=\"" + "http://localhost:8080/img?src=" + reader.result + "&version=" + myDate.getTime() + "\" />" +
                    //     "<param name=\"autostart\" value=\"true\" />" +
                    //     " <param name=\"controller\" value=\"true\" />" +
                    //     "</object> ");
                    $("#preview").append("<object class=\".img-responsive\"  data=\""+reader.result+"\" type=\"video/avi\" /> "+"<h3 style='color: red;'>新版浏览器不再支持AVI播放，请到本地查看文件</h3>");

                } else { 
                    $("#inputimage").attr("src", reader.result);
                }
                
            };
        } 
    });

    $("#startBtn,#cameraBtn").click(function () {
        //$("#startBtn").attr({ "disabled": "disabled" });
        
        
        let mode = $("#mode option:selected").val();
        let x = $("#x_value").val();
        let y = $("#y_value").val();
        if ((x%16 !=0 && x != -1)|| (y%16 != 0 && y != -1)) {
            alert("输入的精度必须是16的倍数或-1");
            return ;
        }
        let model = ($("#model option:selected").val() == "BODY_25") ? "" : " --model_pose " + $("#model option:selected").val();
        let background = ($("#background").prop('checked')) ? "" : " --disable_blending";
        let body = ($("#body").prop('checked')) ? "" : " --render_pose 0";
        let face = ($("#face").prop('checked')) ? " --face" : "";
        let hand = ($("#hand").prop('checked')) ? " --hand" : "";
        // -body_disable
        let runner = "bin\\OpenPoseDemo_" + mode + ".exe";
        console.log("bin/OpenPoseDemo.exe --display 0" + 
            " --net_resolution'" + x + "x" + y + "'" +
            model +
            background +
            face +
            hand +
            body); 
        
        var isvideo;
        if ($("#startBtn").attr("video") == "false") {
            isvideo = false;
        } else { 
            isvideo = true;
        }

        $("#runing").css('display', 'block');
        var formData = new FormData();
        
        formData.append("runner", runner);
        // formData.append("input", file)
        formData.append("params", " --net_resolution \"" + x + "x" + y + "\"" +
            model + background + face + hand + body);
        // alert($(this).attr('id'));
        formData.append("mode", $(this).attr('id'));
        formData.append("isvideo", isvideo);
        //alert("后台识别程序开始运行，请耐心等待")
        

        $.ajax({
            url:'http://localhost:8080/run',
            dataType: 'json',
           // dataType:"application/x-www-form-urlencoded",
            type:"post",
            data: formData,
            cache: false,
            // async: false, 
            processData : false, // 使数据不做处理
            contentType : false, // 不要设置Content-Type请求头
            success: function (data) {
                console.log(data);
                // alert(data);
                $("#runing").css('display', 'none');
                
                if (data == 0) {
                    alert("运行完成！在右侧输出栏查看输出结果");
                } else if (data == 1) {
                    alert("人为终止程序！");
                } else if (data == -1) {
                    alert("程序出现错误终止！");
                } else if (data == -2) {
                    alert("输入文件不能为空！");
                }  else if (data == -3) {
                    alert("处理视频时出现错误，结果可能不全");
                } else if (data == -1073740791) {
                    alert("内存不足，建议将精度调小")
                } else { 
                    alert("出现未知错误！错误码为：" + data);
                }
                getulListout();
            },
            error: function (response) {
                console.log("err")
                console.log(response);
                
                
                //$("#outputimage").attr("src", response);
                // $("#inputimage").attr("src", response.responseText);
            }

        });
        
    });

    $("#explorerBtn").click(function () { 
        var content;
        if ($("#startBtn").attr("video") == "true") {
            content = "/video";
        } else { 
            content = "/images";
        }
        $.ajax({
            url: 'http://localhost:8080/cmd?head='+encodeURI("cmd /c start ")+'&content='+content,
            type: "get",
            cache: false,
        })
    })

    $("#stopBtn").click(function () {
        $.ajax({
            url:'http://localhost:8080/kill',
            dataType: 'json',
           // dataType:"application/x-www-form-urlencoded",
            type: "get",
            cache: false,
            success: function (data) {
                console.log(data);
                if (data == true) {
                    $("#runing").css('display', 'none');
                    
                } else { 
                    alert("出现错误！程序未运行或是其他错误");
                }
               
                
            },
            error: function (response) {
                console.log("err")
                console.log(response);
            }
        });
        
        
    });


    $("#listul,#listulout").on("click",".dela",function () {
        // console.log("");
        console.log($(this).parent().children("p").attr("value"));
        $.ajax({
            url: "http://localhost:8080/del?src=" + encodeURI($(this).parent().children("p").attr("value")),
            dataType: 'json',
            // dataType:"application/x-www-form-urlencoded",
            type: "get",
            cache: false,
            // sync: false, 
            success: function (data) {
                console.log(data)
                if (data == true) {
                    alert("删除成功！");
                    getulList();
                    getulListout();
    
                } else {
                    alert("删除失败！");
                }
               
            },
            error: function (response) {
                console.log("err")
                console.log(response);
            }
        });
        //return false;
        event.stopPropagation();
        
    });

    $("#outh").click(function () {
        $("#listulout").slideToggle();
    });

    $("#inh").click(function () {
        // $("#listul").animate({ height: 'toggle' });
        // $("#inputfile").animate({ height: 'toggle' });
        $("#listul").slideToggle("normal", function () { 
            $(".littlebox").slideToggle("fast");
        });

    });

    
});

function setImg(obj) {
    var myDate = new Date();
    // alert(obj.getAttribute("value"))
    var url = "http://localhost:8080/img?src=" + encodeURI(obj.getAttribute("value")) + "&version=" + myDate.getTime();
    
    if ($("#startBtn").attr("video") == "true") {
        $("#preview").empty();
        // $("#preview").append("<video class=\"inputvideo\"  controls='' autoplay='' name='media'><source src="+"http://localhost:8080/img?src="+encodeURI(obj.getAttribute("value"))+"&version="+ myDate.getTime()+" type='video/avi'></video>");
        // $("#preview").append(
        //     "<object type=\"video / x - msvideo\" data=\"video.avi\"  width=\"320\" height=\"240\">" +
        //     "<param name=\"src\" value=\"" + "http://localhost:8080/img?src=" + encodeURI(obj.getAttribute("value")) + "&version=" + myDate.getTime() + "\" />" +
        //     "<param name=\"autostart\" value=\"true\" />" +
        //     " <param name=\"controller\" value=\"true\" />" +
        //     "</object> ");
        $("#preview").append("<object class=\".img-responsive\"  data=\""+url+"\" type=\"video/avi\" /> "+"<h3 style='color: red;'>新版浏览器不再支持AVI播放，请到本地查看文件</h3>");

    } else { 
        $("#inputimage").attr("src", url);
        
    }
}

function setoutImg(obj) {
    var myDate = new Date();
    console.log($("#startBtn").attr("video"));
    var url = "http://localhost:8080/img?src=" + encodeURI(obj.getAttribute("value")) + "&version=" + myDate.getTime();
    if ($("#startBtn").attr("video") == "true") {
        $("#previewout").empty();
        // $("#previewout").append("<video class=\"inputvideo\"  controls='' autoplay='' name='media'><source src=" + "http://localhost:8080/img?src=" + encodeURI(obj.getAttribute("value")) + "&version=" + myDate.getTime() + " type='video/avi'></video>");
        $("#previewout").append("<object class=\".img-responsive\"  data=\""+url+"\" type=\"video/avi\" /> "+"<h3 style='color: red;'>新版浏览器不再支持AVI播放，请到本地查看文件</h3>");
  
            
           
    } else { 
        console.log("image");
        $("#outputimage").attr("src", url);

    }
}
