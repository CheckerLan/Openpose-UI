package com.action_openpose.checker.action_openpose.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class ExecService {
    private Process process;

    private volatile boolean isOpen = false;
    //private static volatile AtomicBoolean isOpen = new AtomicBoolean(false);

    //private static ExecutorService pool = Executors.newSingleThreadExecutor();

    public int execCommand(String command) {
        //pool.execute();

        if (isOpen) {
            return -1;
        } else {
            isOpen = true;
            int exitVal = -1;

            try {
                System.out.println("exec:"+command);
                process = Runtime.getRuntime().exec(command);
                exitVal = process.waitFor();
                System.out.println("Process exitValue: " + exitVal);
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }

            isOpen = false;
            return exitVal;
        }
    }

    public boolean killCommand() {
        if (isOpen) {
            //Runtime.getRuntime().exit(-1);
            process.destroy();
            System.out.println("killed");
            return true;
        } else {
            return false;
        }
    }

    public String savefile(MultipartFile file, Boolean isvideo) {
//        BufferedOutputStream stream = null;
        if (!file.isEmpty()) {
            try {
                String path = getPath();
                if (isvideo) {
                    path += "/video/";
                } else {
                    path += "/images/";
                }

                System.out.println(path);
                File pathFile = new File(path);
                if (!pathFile.exists()) {
                    pathFile.mkdirs();
                }

                System.out.println(path + file.getOriginalFilename());
                File newFile = new File(path + file.getOriginalFilename());
                if (!newFile.exists()) {
                    newFile.createNewFile();
                }
                BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(newFile));
                out.write(file.getBytes());
                out.flush();
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return file.getOriginalFilename();
        }
        return "";
    }

    public String getPath() throws FileNotFoundException {
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) {
            path = new File("");
        }
        return path.getAbsolutePath();
    }

//    public synchronized int run(String command) throws InterruptedException {
//        int exitVal = -1;
//        while (!isOpen) {
//            this.wait();
//        }
//        try {
//            process = Runtime.getRuntime().exec(command);
//            exitVal = process.waitFor();
//            System.out.println("Process exitValue: " + exitVal);
//        } catch (IOException | InterruptedException e) {
//            e.printStackTrace();
//        }
//
//        isOpen = false;
//        this.notifyAll();
//        return exitVal;
//    }

}
