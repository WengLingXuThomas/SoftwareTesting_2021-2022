package be.imatex.domain;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * POJO voor bestellingen tabel
 */
@Entity
@Table(name = "bestellingen")
@Data
@RequiredArgsConstructor
@NoArgsConstructor(force=true)
public class Bestelling {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    private int bestellingsnummer;

    private Date bestellingsdatum;

    private int klantnummer;

    private String schermIds;

    private String verpakkingsInformatie;

    private String status;


}
