package be.imatex.controller;

import be.imatex.Models.BestellingInfo;
import be.imatex.Models.BestellingModel;
import be.imatex.Models.SchermInfo;
import be.imatex.dao.BestellingRepository;
import be.imatex.dao.KlantRepository;
import be.imatex.dao.SchermRepository;
import be.imatex.domain.Bestelling;
import be.imatex.domain.Scherm;
import be.imatex.formdata.BestellingData;

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
@RequestMapping("/bestelling")
public class BestellingController {

    private List<Scherm> besteldeSchermen = new ArrayList<Scherm>();

    @Autowired
    BestellingRepository bestellingRepository;

    @Autowired
    KlantRepository klantRepository;

    @Autowired
    SchermRepository schermRepository;

    @Autowired
    private BestellingService bestellingService;

    /**
     * Prepare form for create
     */
    @GetMapping
    public String bestellingCreateForm(Model model) {

        BestellingData bestellingData = bestellingService.prepareNewBestellingData();
        SchermData schermData = bestellingService.prepareNewSchermData();

        BestellingModel bestellingModel = new BestellingModel();
        bestellingModel.setBestellingData(bestellingData);
        bestellingModel.setSchermData(schermData);

        prepareForm(bestellingModel, model);
        return "bestelling";
    }

    /**
     * Prepares the form with data for projects- and objectives comboboxes
     */
    private void prepareForm(BestellingModel bestellingModel, Model model) {
        model.addAttribute("bestellingModel", bestellingModel );
    }

    /**
     * Prepares the form with data for projects- and objectives comboboxes
     */
    private void prepareForm(BestellingData bestellingData, Model model) {
        model.addAttribute("bestellingData", bestellingData );
    }


    /**
     * Process the form
     * @param bestellingModel the data for the entry to be saved
     */
    @PostMapping(params = "submit")
    public String processBestelling(@Validated(BestellingInfo.class)  BestellingModel bestellingModel, Errors errors, Model model) {

        BestellingData bestellingData = bestellingModel.getBestellingData();

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

                if (klantRepository.existsById((long)bestellingData.getKlantnummer())){
                    // klant bestaat dus inorde
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
                        message = bestellingService.processBestelling(bestellingData, schermIds);

                        Bestelling lastBestelling = bestellingRepository.findFirstByOrderByIdDesc();
                        int laatsteBestellingId = (int) lastBestelling.getId();

                        message = bestellingService.processSchermen(besteldeSchermen, laatsteBestellingId);
                        besteldeSchermen = new ArrayList<Scherm>();
                        // Prepare form for new data-entry
                        bestellingModel = new BestellingModel();
                        return "succes";
                    }
                }else{
                    message = "klantnummer niet gevonden";
                }

            }

        } catch (NullPointerException e) {
            message="Vul ontrbrekende gegevens in";
            System.out.println(e.toString());
        }

        prepareForm(bestellingModel, model);
        model.addAttribute("message1", message);
        return "bestelling";
    }


    @PostMapping(params = "schermToevoegen")
    public String schermToevoegen(@Validated(SchermInfo.class)  BestellingModel bestellingModel, Errors errors, Model model) {
        SchermData schermData = bestellingModel.getSchermData();
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

            BestellingData tempBestellingData = bestellingModel.getBestellingData();
            bestellingModel = new BestellingModel();
            bestellingModel.setBestellingData(tempBestellingData);

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
        prepareForm(bestellingModel, model);

        return "bestelling";
    }


    /**
     * Prepare form for update
     * @param id - the id of the bestelling to be updated
     * @param model
     * @return
     */
    @GetMapping("/edit")
    public String bestellingEditForm(@RequestParam("id") long id, Model model) {
        BestellingData bestellingData = bestellingService.prepareBestellingDataToEdit(id);
        model.addAttribute("bestellingData", bestellingData);
        return "bestellingEdit";
    }
    /**
     * Process the form
     * @param bestellingData the data for the order to be saved
     */
    @PostMapping(params = "update")
    public String updateBestelling(@Valid BestellingData bestellingData, Errors errors, Model model) {

        String message="";

        try {
            // Are there any remaining input validation errors detected by JSR 380 bean validation?
            if (errors.hasErrors() ) {
                message = "Verbeter de invoer velden";
            }else{
                // Now that the input seems to be OK, let's update an existing bestelling
                message = bestellingService.updateBestelling(bestellingData);
            }
        } catch (NullPointerException e) {
            message="Vul ontrbrekende gegevens in";
        }



        Bestelling bestelling = bestellingService.zoekBestellingMetId(bestellingData.getId());
        List<Scherm> schermen = bestellingService.geefSchermenByBestelling((int)bestellingData.getId());
        model.addAttribute("bestelling", bestelling);
        model.addAttribute("schermen", schermen);
        return "bestellingDetail";
    }

    /**
     * Prepare form for delete
     * @param id - the id of the bestelling to be deleted
     * @param model
     * @return
     */
    @GetMapping("/verwijderen")
    public String verwijderForm(@RequestParam("id") long id, Model model) {
        BestellingData bestellingData = bestellingService.prepareBestellingDataToDelete(id);
        model.addAttribute("bestellingData", bestellingData);
        return "delete";
    }

    @PostMapping(params = "delete")
    public String deleteEntry(BestellingData bestellingData, Model model) {
        bestellingService.deleteBestelling(bestellingData.getId());
        Iterable<Bestelling> bestellingList = bestellingService.alleBestellingen();
        model.addAttribute("bestellingen", bestellingList);
        return "bestellingenOverzicht";
    }


}


