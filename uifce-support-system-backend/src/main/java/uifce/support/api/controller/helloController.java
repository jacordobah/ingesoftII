package uifce.support.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uifce.support.api.model.location.BuildingRepository;

@RestController
@RequestMapping("/hello")
public class helloController {

    @GetMapping
    public String helloWord(){
        return "Hello World cito";
    }

}
