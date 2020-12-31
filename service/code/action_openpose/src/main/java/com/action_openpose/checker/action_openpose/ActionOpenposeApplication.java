package com.action_openpose.checker.action_openpose;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class ActionOpenposeApplication {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(ActionOpenposeApplication.class, args);
        Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler "+"client\\index.html");
        System.out.println("点击 client\\index.html 链接访问页面，或者将client部署到服务端进行访问");
    }

}
