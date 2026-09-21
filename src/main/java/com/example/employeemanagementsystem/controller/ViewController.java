package com.example.employeemanagementsystem.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ViewController {

    @GetMapping(value = {"/", "/index.html"}, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public Resource index() {
        return new ClassPathResource("static/index.html");
    }

    @GetMapping(value = "/css/styles.css", produces = "text/css")
    @ResponseBody
    public Resource css() {
        return new ClassPathResource("static/css/styles.css");
    }

    @GetMapping(value = "/js/app.js", produces = "application/javascript")
    @ResponseBody
    public Resource js() {
        return new ClassPathResource("static/js/app.js");
    }
}
