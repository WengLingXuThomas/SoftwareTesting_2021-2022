package be.imatex.Models;

import be.imatex.formdata.BestellingData;
import be.imatex.formdata.BestellingNKlantData;
import be.imatex.formdata.SchermData;

import javax.validation.Valid;

public class BestellingNKlantModel {

    @Valid
    private BestellingNKlantData bestellingNKlantData;

    @Valid
    private SchermData schermData;

    public BestellingNKlantData getBestellingNKlantData() {
        return bestellingNKlantData;
    }

    public void setBestellingNKlantData(BestellingNKlantData bestellingNKlantData) {
        this.bestellingNKlantData = bestellingNKlantData;
    }

    public SchermData getSchermData() {
        return schermData;
    }

    public void setSchermData(SchermData schermData) {
        this.schermData = schermData;
    }
}
