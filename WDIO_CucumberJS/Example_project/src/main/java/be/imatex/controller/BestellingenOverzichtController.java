package be.imatex.controller;

import be.imatex.dao.BestellingRepository;
import be.imatex.dao.SchermRepository;
import be.imatex.domain.Bestelling;
import be.imatex.domain.Scherm;
import be.imatex.formdata.BestellingData;
import be.imatex.service.BestellingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Controller
public class BestellingenOverzichtController {


    @Autowired
    private BestellingService bestellingService;


    @RequestMapping(value={"/bestellingenOverzicht"}, method=RequestMethod.GET)
        public String bestellingOverzicht(Model model) {
        Iterable<Bestelling> bestellingList = bestellingService.alleBestellingen();
        model.addAttribute("bestellingen", bestellingList);
        return "bestellingenOverzicht";
    }

    @RequestMapping(value={"/bestellingDetail.html"}, method=RequestMethod.GET)
    public String bestellingDetail(@RequestParam("id") Integer id, Model model){
        Bestelling bestelling = bestellingService.zoekBestellingMetId(id);
        List<Scherm> schermen = bestellingService.geefSchermenByBestelling(id);
        model.addAttribute("bestelling", bestelling);
        model.addAttribute("schermen", schermen);
        return "bestellingDetail";
    }
}
