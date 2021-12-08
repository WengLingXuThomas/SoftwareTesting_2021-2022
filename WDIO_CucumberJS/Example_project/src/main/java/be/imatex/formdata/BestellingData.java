package be.imatex.formdata;

import be.imatex.Models.BestellingInfo;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class BestellingData {
    // id is needed for updating
    private long id=0;

    private int bestellingsnummer;

    private Date bestellingsdatum;

    @NotNull(message = "klantnummer moet ingevuld worden", groups = BestellingInfo.class)
    private Integer klantnummer;

    private String schermIds;

    private String verpakkingsInformatie;

    private String status;

}
