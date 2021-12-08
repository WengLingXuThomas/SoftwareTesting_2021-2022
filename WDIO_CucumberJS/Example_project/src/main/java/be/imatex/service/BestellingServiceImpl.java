package be.imatex.service;

import be.imatex.dao.BestellingRepository;
import be.imatex.dao.KlantRepository;
import be.imatex.dao.SchermRepository;
import be.imatex.dao.UserRepository;
import be.imatex.domain.Bestelling;
import be.imatex.domain.Klant;
import be.imatex.domain.Scherm;
import be.imatex.domain.User;
import be.imatex.formdata.BestellingData;
import be.imatex.formdata.BestellingNKlantData;
import be.imatex.formdata.SchermData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class BestellingServiceImpl implements  BestellingService{

    @Autowired
    BestellingRepository bestellingRepository;

    @Autowired

    UserRepository userRepository;

    KlantRepository klantRepository;

    @Autowired
    SchermRepository schermRepository;

    /**
     * Instantiates and initializes new EntryData-object
     * to be used in the form
     * @return
     */
    public BestellingData prepareNewBestellingData() {
        return prepareBestellingData();
    }


    public BestellingNKlantData prepareNewBestellingNKantData() {
        return prepareBestellingNKlantData();
    }

    /**
     * Prepares an BestellingData-object based on an Bestelling-object
     * @return
     */
    private BestellingData prepareBestellingData() {

        BestellingData bestellingData = new BestellingData();
        return bestellingData;
    }
    private BestellingNKlantData prepareBestellingNKlantData() {

        BestellingNKlantData bestellingNKlantData = new BestellingNKlantData();
        return bestellingNKlantData;
    }


    private BestellingData prepareBestellingData(Bestelling bestelling) {

        BestellingData bestellingData = new BestellingData();

        bestellingData.setKlantnummer(bestelling.getKlantnummer());
        bestellingData.setVerpakkingsInformatie(bestelling.getVerpakkingsInformatie());
        bestellingData.setStatus(bestelling.getStatus());

        return bestellingData;
    }

    /**
     * Instantiates and initializes new EntryData-object
     * to be used in the form
     * @return
     */
    public SchermData prepareNewSchermData() {
        return prepareSchermData();
    }

    /**
     * Prepares an SchermData-object based on an Scherm-object
     * @return
     */
    private SchermData prepareSchermData() {
        SchermData schermData = new SchermData();
        return schermData;
    }

    @Override
    public String processBestelling(BestellingData bestellingData, String schermIds) {

        Bestelling bestelling;

        if (bestellingData.getId() == 0) bestelling = new Bestelling();
        else bestelling = bestellingRepository.findById( bestellingData.getId() );

        // laatste bestellingsnummer opzoeken
        if (bestellingRepository.count() == 0){
            bestelling.setBestellingsnummer(1);
        }else{
            Bestelling lastBestelling = bestellingRepository.findFirstByOrderByIdDesc();
            long lastId = lastBestelling.getId();
            int bestellingsnummmer = (int)(lastId+1);
            bestelling.setBestellingsnummer(bestellingsnummmer);
        }

        Date bestellingsdatum = new Date();
        bestelling.setBestellingsdatum(bestellingsdatum);

        bestelling.setStatus("Nieuw");

        int klantnummer = bestellingData.getKlantnummer();
        bestelling.setKlantnummer(klantnummer);

        String verpakkingsinformatie = bestellingData.getVerpakkingsInformatie();
        bestelling.setVerpakkingsInformatie(verpakkingsinformatie);
        bestelling.setSchermIds(schermIds);

        // Save the newly created bestelling
        bestellingRepository.save(bestelling);

        return "Bestelling met bestellingsnummer "+ bestelling.getBestellingsnummer() + " verwerkt";
    }

    @Override
    public String processBestellingNklant(BestellingNKlantData bestellingNKlantData, String schermIds) {

        Bestelling bestelling;

        if (bestellingNKlantData.getId() == 0) bestelling = new Bestelling();
        else bestelling = bestellingRepository.findById( bestellingNKlantData.getId() );

        // laatste bestellingsnummer opzoeken
        if (bestellingRepository.count() == 0){
            bestelling.setBestellingsnummer(1);
        }else{
            Bestelling lastBestelling = bestellingRepository.findFirstByOrderByIdDesc();
            long lastId = lastBestelling.getId();
            int bestellingsnummmer = (int)(lastId+1);
            bestelling.setBestellingsnummer(bestellingsnummmer);
        }

        Date bestellingsdatum = new Date();
        bestelling.setBestellingsdatum(bestellingsdatum);

        bestelling.setStatus("Nieuw");

        Klant klant = new Klant();
        klant.setNaam(bestellingNKlantData.getNaam());
        klant.setVoornaam(bestellingNKlantData.getVoornaam());
        klant.setTelefoonnummer(bestellingNKlantData.getTelefoonnummer());
        klant.setEmail(bestellingNKlantData.getEmail());
        klant.setPostnummer(bestellingNKlantData.getPostnummer());
        klant.setGemeente(bestellingNKlantData.getGemeente());
        klant.setStraatnaam(bestellingNKlantData.getStraatnaam());
        klant.setStraatnummer(bestellingNKlantData.getStraatnummer());
        klant.setStatus("nieuw");
        klantRepository.save(klant);

        Klant lastKlant = klantRepository.findFirstByOrderByKlantnummerDesc();
        int klantnummer = (int)lastKlant.getKlantnummer();
        bestelling.setKlantnummer(klantnummer);


        String verpakkingsinformatie = bestellingNKlantData.getVerpakkingsInformatie();
        bestelling.setVerpakkingsInformatie(verpakkingsinformatie);
        bestelling.setSchermIds(schermIds);

        // Save the newly created bestelling
        bestellingRepository.save(bestelling);

        return "Bestelling met bestellingsnummer "+ bestelling.getBestellingsnummer() + " verwerkt";
    }

    @Override
    public String processSchermen(Iterable<Scherm> schermen, int bestellingsnummer) {

        for (Scherm scherm:schermen) {
            scherm.setBestellingsnummer(bestellingsnummer);
        }

        schermRepository.saveAll(schermen);
        return "Bestelling en bijhorende schermen verwerkt";
    }

    @Override
    public Iterable<Bestelling> alleBestellingen() {
        return  bestellingRepository.findAll();
    }

    @Transactional(propagation= Propagation.REQUIRED, readOnly=false)
    public Bestelling zoekBestellingMetId(long id){
        return bestellingRepository.findById(id);
    }

    @Override
    public void deleteBestelling(long id) {
        Bestelling bestelling = bestellingRepository.findById(id);
        bestellingRepository.delete(bestelling);
    }

    @Override
    public BestellingData prepareBestellingDataToEdit(long id) {
        Bestelling theBestelling = bestellingRepository.findById(id);
        BestellingData theBestellingData = prepareBestellingData(theBestelling);
        theBestellingData.setId(id);
        return theBestellingData;
    }

    @Override
    public String updateBestelling(@Valid BestellingData bestellingData) {
        Bestelling bestelling;
        bestelling = bestellingRepository.findById( bestellingData.getId() );
        bestelling.setStatus(bestellingData.getStatus());
        bestelling.setKlantnummer(bestellingData.getKlantnummer());
        bestelling.setVerpakkingsInformatie(bestellingData.getVerpakkingsInformatie());
        bestellingRepository.save(bestelling);
        return "Bestelling met bestellingsnummer "+ bestelling.getBestellingsnummer() + " upgedate";
    }

    @Override
    public BestellingData prepareBestellingDataToDelete(long id) {
        Bestelling BestellingToDelete = bestellingRepository.findById(id);
        BestellingData BestellingDataToDelete = prepareBestellingData(BestellingToDelete);
        BestellingDataToDelete.setId(id);
        return BestellingDataToDelete;
    }

    @Override
    public List<Scherm> geefSchermenByBestelling(int id) {

        List<Scherm> bijhorendeSchermen = new ArrayList<>();
        //schermRepository.findAll().forEach(schermen::add);
        for(Scherm scherm:schermRepository.findAll()) {
            if(scherm.getBestellingsnummer() == id) {
                bijhorendeSchermen.add(scherm);
            }
        }
        //Iterable<Scherm> actieveSchermen = schermRepository.findAll();
        return bijhorendeSchermen;
    }
    public String getAuthenticatedUsername() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return currentPrincipalName;
    }

    private User findAuthenticatedUser() {

        String username = getAuthenticatedUsername();
        return userRepository.findByUsername(username);
    }

    @Override
    public String getAuthenticatedUserName() {
        User theUser = findAuthenticatedUser();
        return theUser.getUsername();
    }

}
