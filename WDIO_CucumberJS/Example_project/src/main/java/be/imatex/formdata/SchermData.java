package be.imatex.formdata;
import be.imatex.Models.BestellingInfo;
import be.imatex.Models.SchermInfo;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class SchermData {

    private int id=0;

    private int bestellingsnummer;

    public String status;

    private String locatienummer;

    @NotBlank(message="lengte moet ingevuld worden", groups = SchermInfo.class)
    private String lengte;

    @NotBlank(message="breedte moet ingevuld worden", groups = SchermInfo.class)
    private String breedte;

    @NotBlank(message="dikte moet ingevuld worden", groups = SchermInfo.class)
    private String dikte;

    @NotBlank(message="materiaal type moet ingevuld worden", groups = SchermInfo.class)
    private String materiaalType;

    private String voorkeuren;

    private double prijs;

    @NotNull(message = "aantal moet ingevuld worden", groups = SchermInfo.class)
    private Integer aantal;
}
