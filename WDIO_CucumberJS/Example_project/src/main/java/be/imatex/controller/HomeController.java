package be.imatex.controller;

import be.imatex.domain.User;
import be.imatex.service.BestellingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {
    @Autowired
    BestellingService bestellingService;

    @RequestMapping(value={"/login","/login.html"},method= RequestMethod.GET)
    public String login(ModelMap model){
        return "/login";
    }

    @RequestMapping(value={"/logout","/logout.html"},method= RequestMethod.GET)
    public String logout(ModelMap model){
        return "/logout";
    }

    @RequestMapping(value={"/","/home.html"},method= RequestMethod.GET)
    public String home(ModelMap model) {
        model.addAttribute("Username", bestellingService.getAuthenticatedUserName());
        return "home";
    }

    @GetMapping("/login-error")
    public String loginerror(Model model) {
        model.addAttribute("error", true);
        return "login";
    }

    @RequestMapping(value={"/noAccess","/noAccess.html"},method= RequestMethod.GET)
    public String noAccess(ModelMap model) {
        return "noAccess";
    }


}
