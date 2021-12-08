package be.imatex;

import be.imatex.dao.KlantRepository;
import be.imatex.dao.UserRepository;
import be.imatex.domain.Klant;
import be.imatex.domain.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Database initializer that populates the database with some
 * initial data.
 *
 * This component is started only when app.db-init property is set to true
 */
@Component
@ConditionalOnProperty(name = "app.db-init", havingValue = "true")
public class ImatexApplicationInitDB implements CommandLineRunner {

    @Autowired
    KlantRepository klantRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        List<Klant> klanten = Arrays.asList(
                new Klant(1,"Weng","Thomas","0483395674","thomas.weng@sutdent.odisee.be","9255","Opdorp","Krapstraat","44","regelmatig"),
                new Klant(2,"Kantarama","Kevin","04735395573","kevin.kantarama@sutdent.odisee.be","8630","Zoutenaaie","Heuvenstraat","274","regelmatig"),
                new Klant(3,"Valckenier ","Femke","0495396972","femke.valckenier@sutdent.odisee.be","1370","Zétrud-Lumay","Touwslagerstraat","77","nieuw"),
                new Klant(4,"Ngirinshuti","Christian","0485645333","christian.ngirinshuti@sutdent.odisee.be","7971","Ramegnies","Rue de la Poste","118","nieuw"),
                new Klant(5,"Wong","William","0473345676","william.wong@sutdent.odisee.be","9170","Meerdonk","Jagerij","446","regelmatig"),
                new Klant(6,"Talay","Imane","0489995314","imane.talay@sutdent.odisee.be","7608","Wiers","Mandemakersstraat","427","nieuw")
        );


        List<User> users = Arrays.asList(
                new User((long)1,"kristof","1234","verkoper"),
                new User((long)2,"jef","4321","productiemedewerker"),
                new User((long)3,"admin","admin","admin")

        );

        for (Klant klant: klanten) {
            klantRepository.save(klant);
        }

        for (User user: users) {
            userRepository.save(user);
        }

    }


}
