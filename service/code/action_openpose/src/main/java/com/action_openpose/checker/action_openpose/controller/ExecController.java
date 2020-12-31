package com.action_openpose.checker.action_openpose.controller;

import com.action_openpose.checker.action_openpose.service.ExecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Controller
public class ExecController {
    /**
     * 接收页面请求的JSON参数，并返回JSON格式的结果
     */
    @Autowired
    ExecService execService;

    @RequestMapping(value = "/kill", method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public boolean kill() {
        System.out.println("kill");

        // execService.execCommand(command);
        return execService.killCommand();
    }

    @RequestMapping(value = "/run", method = RequestMethod.POST, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public int test(@RequestParam("runner") String runner,
                    @RequestParam("params") String params,
                    @RequestParam("mode") String mode,
                    @RequestParam("isvideo") Boolean isvideo) throws IOException {

        String commandStr;
        if ("cameraBtn".equals(mode)) {
            commandStr = runner + params;


            System.out.println(commandStr);

            return execService.execCommand(commandStr);
        } else {
            if (isvideo) {
                // 处理输入输出路径
                File path = new File(execService.getPath());

                // 处理输入路径
                String infileStr = path.getAbsolutePath() + "\\video\\";


                File inpath = new File(infileStr);
                if (!inpath.exists()) {
                    return -2;
                    //inpath.mkdirs();
                }

                // 处理输出路径
                String outfilePath = path + "\\video\\out\\";
                File outpath = new File(outfilePath);
                if (!outpath.exists()) {
                    outpath.mkdirs();
                }

                File[] inList = inpath.listFiles();

                for (File file : inList) {
                    if (!file.isDirectory()) {
                        String outfileStr = " --write_video " + outfilePath + file.getName();
                        commandStr = runner + " --display 0 --video " + file.getAbsolutePath() + outfileStr + params;
                        System.out.println(commandStr);
                        int result = execService.execCommand(commandStr);
                        if (result != 0) {
                            return -3;
                        }
                    }
                }


                return 0;
            } else {
                // 处理输入输出路径
                File path = new File(execService.getPath());

                // 处理输入路径
                String infileStr = path.getAbsolutePath() + "\\images\\";


                File inpath = new File(infileStr);
                if (!inpath.exists()) {
                    return -2;
                    //inpath.mkdirs();
                }

                // 处理输出路径
                String outfilePath = path + "\\images\\out\\";
                File outpath = new File(outfilePath);
                if (!outpath.exists()) {
                    outpath.mkdirs();
                }

                String outfileStr = " --write_images " + outfilePath;

                commandStr = runner + " --display 0 --image_dir " + infileStr + outfileStr + params;

                System.out.println(commandStr);

                return execService.execCommand(commandStr);

            }

        }

    }

    //    @GetMapping(value = "/image", produces = MediaType.IMAGE_JPEG_VALUE)
    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public List<String> getList(String src) throws IOException {


        String path = execService.getPath() + "\\" + src;

        List<String> files = new ArrayList<>();
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }

        File[] tempList = file.listFiles();

        for (int i = 0; i < Objects.requireNonNull(tempList).length; i++) {
            if (tempList[i].isFile()) {
                files.add(tempList[i].toString());
                //文件名，不包含路径
                //String fileName = tempList[i].getName();
            }
        }
        System.out.println(files);
        return files;
    }

    @RequestMapping(value = "/updateImg", method = RequestMethod.POST, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String updateImg(@RequestParam("input") MultipartFile input, @RequestParam("isvideo") Boolean isvideo) throws IOException {

        String str = execService.savefile(input, isvideo);
        System.out.println(str);
        if ("".equals(str)) {
            return str;
        }
        return execService.getPath() + "\\" + str;
    }

    @RequestMapping(value = "/img", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] getImg(String src) throws IOException {
        System.out.println(src);
        File file = new File(src);
        FileInputStream inputStream = new FileInputStream(file);
        byte[] bytes = new byte[inputStream.available()];
        inputStream.read(bytes, 0, inputStream.available());
        inputStream.close();
        return bytes;
    }

    @RequestMapping(value = "/cmd", method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public int cmd(String head, String content) throws FileNotFoundException {
        return execService.execCommand(head + " " + execService.getPath() + content);
    }

    @RequestMapping(value = "/del", method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public boolean deleteImg(String src) {
        System.out.println("del:" + src);
        File file = new File(src);
        if (file.exists()) {
            return file.delete();
        } else {
            return false;
        }
    }

    //    @RequestMapping(value = "/run/{command}", method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
//@PathVariable("command")
    @RequestMapping(value = "/test", method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    public String listdocumentnpi(String command) throws FileNotFoundException {

        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) {
            path = new File("");
        }
        System.out.println(path.getAbsolutePath());
        System.out.println(path.getPath());
        System.out.println(path.getName());
        return path.getAbsolutePath();
    }

}
