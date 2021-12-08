package be.imatex.controller;

import be.imatex.domain.Bestelling;
import be.imatex.domain.Scherm;
import be.imatex.service.BestellingService;
import be.imatex.service.SchermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller // foutmelding
public class SchermController {
    @Autowired
    private SchermService schermService;
    /*@RequestMapping(value={"/schermOverzicht"}, method= RequestMethod.GET)
    public String geefSchermList(Model model) {
        Iterable<Scherm> schermen = schermService.alleSchermenByStatus();
        model.addAttribute("schermen", schermen);
        return "schermOverzicht";
    }*/
    @RequestMapping(value={"/schermOverzicht"}, method= RequestMethod.GET)
    public String geefSchermList(Model model) {
        Iterable<Scherm> schermen = schermService.geefActieveSchermen();
        model.addAttribute("schermen", schermen);
        return "schermOverzicht";
    }




}
