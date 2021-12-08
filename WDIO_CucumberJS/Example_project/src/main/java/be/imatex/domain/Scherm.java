package be.imatex.domain;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;


/**
 * POJO voor bestellingen tabel
 */
@Entity
@Table(name = "schermen")
@Data
@RequiredArgsConstructor
public class Scherm {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int bestellingsnummer;
    public String status;
    private String locatienummer;
    private String lengte;
    private String breedte;
    private String dikte;
    private String materiaalType;
    private String voorkeuren;
    private int aantal;
    private double prijs;
    public int getBestellingsnummer() {
        return bestellingsnummer;
    }
}
