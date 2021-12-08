package be.imatex.Models;

import be.imatex.formdata.BestellingData;
import be.imatex.formdata.SchermData;

import javax.validation.Valid;

public class BestellingModel {

    @Valid
    private BestellingData bestellingData;

    @Valid
    private SchermData schermData;

    public BestellingData getBestellingData() {
        return bestellingData;
    }

    public void setBestellingData(BestellingData bestellingData) {
        this.bestellingData = bestellingData;
    }

    public SchermData getSchermData() {
        return schermData;
    }

    public void setSchermData(SchermData schermData) {
        this.schermData = schermData;
    }
}
