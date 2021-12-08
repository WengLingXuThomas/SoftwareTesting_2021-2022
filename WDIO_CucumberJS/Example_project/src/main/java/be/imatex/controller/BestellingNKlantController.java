package be.imatex.controller;

import be.imatex.Models.*;
import be.imatex.dao.BestellingRepository;
import be.imatex.dao.SchermRepository;
import be.imatex.domain.Bestelling;
import be.imatex.domain.Scherm;
import be.imatex.formdata.BestellingData;

import be.imatex.formdata.BestellingNKlantData;
import be.imatex.formdata.SchermData;
import be.imatex.service.BestellingService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.springframework.validation.Errors;
import javax.validation.Valid;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/bestellingNieuweKlant")
public class BestellingNKlantController {

    private List<Scherm> besteldeSchermen = new ArrayList<Scherm>();

    @Autowired
    BestellingRepository bestellingRepository;

    @Autowired
    SchermRepository schermRepository;

    @Autowired
    private BestellingService bestellingService;

    /**
     * Prepare form for create
     */
    @GetMapping
    public String bestellingNieuweKlantCreateForm(Model model) {

        BestellingNKlantData bestellingNKlantData = bestellingService.prepareNewBestellingNKantData();
        SchermData schermData = bestellingService.prepareNewSchermData();

        BestellingNKlantModel bestellingNKlantModel = new BestellingNKlantModel();
        bestellingNKlantModel.setBestellingNKlantData(bestellingNKlantData);
        bestellingNKlantModel.setSchermData(schermData);

        prepareForm(bestellingNKlantModel, model);
        return "bestellingNieuweKlant";
    }

    /**
     * Prepares the form with data for projects- and objectives comboboxes
     */
    private void prepareForm(BestellingNKlantModel bestellingNKlantModel, Model model) {
        model.addAttribute("bestellingNKlantModel", bestellingNKlantModel );
    }

    /**
     * Prepares the form with data for projects- and objectives comboboxes
     */
    private void prepareForm(BestellingNKlantData bestellingNKlantData, Model model) {
        model.addAttribute("bestellingNKlantData", bestellingNKlantData );
    }

    @PostMapping(params = "bevestig")
    public String processBestelling(@Validated(BestellingInfoNK.class)  BestellingNKlantModel bestellingNKlantModel, Errors errors, Model model) {

        BestellingNKlantData bestellingNKlantData = bestellingNKlantModel.getBestellingNKlantData();

        String message="";
        int lastFreeId = 0;

        try {
            // Are there any remaining input validation errors detected by JSR 380 bean validation?
            if (errors.hasErrors() ) {
                message = "Verbeter de invoer velden";
                for (ObjectError error: errors.getAllErrors()) {
                    System.out.println(error.toString());
                }
            }else{
                    if (besteldeSchermen.size() <= 0){
                        message = "Voeg minstens een scherm toe aan de bestelling";
                    }else{

                        // laatste bestellingsnummer opzoeken
                        if (schermRepository.count() == 0){
                            lastFreeId = 1;
                        }else{
                            Scherm lastScherm = schermRepository.findFirstByOrderByIdDesc();
                            lastFreeId = lastScherm.getId() + 1;
                        }

                        String schermIds = "";

                        for(int i = 0; i < besteldeSchermen.size(); i++)
                        {
                            schermIds = schermIds + lastFreeId + ";";
                            lastFreeId++;
                        }
                        schermIds = schermIds.substring(0, schermIds.length()  - 1);

                        // Now that the input seems to be OK, let's create a new entry or update/delete an existing entry
                        message = bestellingService.processBestellingNklant(bestellingNKlantData, schermIds);

                        Bestelling lastBestelling = bestellingRepository.findFirstByOrderByIdDesc();
                        int laatsteBestellingId = (int) lastBestelling.getId();

                        message = bestellingService.processSchermen(besteldeSchermen, laatsteBestellingId);
                        besteldeSchermen = new ArrayList<Scherm>();
                        // Prepare form for new data-entry
                        bestellingNKlantModel = new BestellingNKlantModel();
                        return "succes";
                    }


            }

        } catch (Exception e) {
            message=e.toString();
            System.out.println(e.toString());
        }

        prepareForm(bestellingNKlantModel, model);
        model.addAttribute("message1", message);
        return "bestellingNieuweKlant";
    }


    @PostMapping(params = "schermToevoegen")
    public String schermToevoegen(@Validated(SchermInfo.class)  BestellingNKlantModel bestellingNKlantModel, Errors errors, Model model) {
        SchermData schermData = bestellingNKlantModel.getSchermData();
        String message1="";
        String message2="";
        try{
            // Are there any remaining input validation errors detected by JSR 380 bean validation?
            if (errors.hasErrors() ) {
                message1 = "Verbeter de invoer velden";
                for (ObjectError error: errors.getAllErrors()) {
                    System.out.println(error.toString());
                }
            }


            Scherm scherm = new Scherm();
            scherm.setStatus("Actief");
            scherm.setLengte(schermData.getLengte());
            scherm.setBreedte(schermData.getBreedte());
            scherm.setDikte(schermData.getDikte());
            scherm.setMateriaalType(schermData.getMateriaalType());
            scherm.setVoorkeuren(schermData.getVoorkeuren());
            scherm.setAantal(schermData.getAantal());

            besteldeSchermen.add(scherm);
            message2 = "scherm toegevoegd";

            besteldeSchermen.forEach((s) -> System.out.println(s));

            BestellingNKlantData tempBestellingData = bestellingNKlantModel.getBestellingNKlantData();
            bestellingNKlantModel = new BestellingNKlantModel();
            bestellingNKlantModel.setBestellingNKlantData(tempBestellingData);

        }catch (NullPointerException e){
            message1="Vul vereiste gegevens in";
        }

        if(message1 != ""){
            model.addAttribute("message1", message1);
        }

        if(message2 != ""){
            model.addAttribute("message2", message2);
        }

        model.addAttribute("schermen", besteldeSchermen );
        prepareForm(bestellingNKlantModel, model);

        return "bestellingNieuweKlant";
    }


}
