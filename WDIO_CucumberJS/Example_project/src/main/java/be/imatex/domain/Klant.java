package be.imatex.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "klanten")
@Data
@RequiredArgsConstructor  // generates constructor with required arguments - final fields and @NonNull-fields
@NoArgsConstructor(access= AccessLevel.PUBLIC,force=true)
public class Klant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long klantnummer;
    @NonNull
    private String naam;
    @NonNull
    private String voornaam;
    @NonNull
    private String telefoonnummer;
    @NonNull
    private String email;
    @NonNull
    private String postnummer;
    @NonNull
    private String gemeente;
    @NonNull
    private String straatnaam;
    @NonNull
    private String straatnummer;
    @NonNull
    private String status;

}
