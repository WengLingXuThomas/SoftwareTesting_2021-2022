package be.imatex.service;

import be.imatex.domain.Bestelling;
import be.imatex.domain.Scherm;
import be.imatex.formdata.BestellingData;
import be.imatex.formdata.BestellingNKlantData;
import be.imatex.formdata.SchermData;

import javax.validation.Valid;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface BestellingService {

    public Iterable<Bestelling> alleBestellingen();

    public BestellingData prepareNewBestellingData();

    public BestellingNKlantData prepareNewBestellingNKantData();

    public String processBestelling(@Valid BestellingData bestellingData, String schermIds);

    public String processBestellingNklant(@Valid BestellingNKlantData bestellingNKlantData, String schermIds);

    public SchermData prepareNewSchermData();

    public String processSchermen(@Valid Iterable<Scherm> schermen, int bestellingsnummer);

    public Bestelling zoekBestellingMetId (long id);

    public void deleteBestelling(long id);

    public BestellingData prepareBestellingDataToEdit(long id);

    public String updateBestelling(@Valid BestellingData bestellingData);

    public BestellingData prepareBestellingDataToDelete(long id);
    public List<Scherm> geefSchermenByBestelling(int id);
    public String getAuthenticatedUserName();

}
