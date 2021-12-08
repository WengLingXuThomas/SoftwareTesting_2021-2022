package be.imatex.formdata;

import be.imatex.Models.BestellingInfo;
import be.imatex.Models.BestellingInfoNK;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
@Data
public class BestellingNKlantData {
    // id is needed for updating
    private long id=0;

    private int bestellingsnummer;

    private Date bestellingsdatum;

    private String schermIds;

    private String verpakkingsInformatie;

    private String status;

    @NotBlank(message = "klant naam moet ingevuld worden", groups = BestellingInfoNK.class)
    private String naam;
    @NotBlank(message = "klant voornaam moet ingevuld worden", groups = BestellingInfoNK.class)
    private String voornaam;
    @NotBlank(message = "klant telefoonnummer moet ingevuld worden", groups = BestellingInfoNK.class)
    private String telefoonnummer;
    @NotBlank(message = "email moet ingevuld worden", groups = BestellingInfoNK.class)
    private String email;
    @NotBlank(message = "postnummer moet ingevuld worden", groups = BestellingInfoNK.class)
    private String postnummer;
    @NotBlank(message = "gemeente moet ingevuld worden", groups = BestellingInfoNK.class)
    private String gemeente;
    @NotBlank(message = "straatnaam moet ingevuld worden", groups = BestellingInfoNK.class)
    private String straatnaam;
    @NotBlank(message = "straatnummer moet ingevuld worden", groups = BestellingInfoNK.class)
    private String straatnummer;

}
