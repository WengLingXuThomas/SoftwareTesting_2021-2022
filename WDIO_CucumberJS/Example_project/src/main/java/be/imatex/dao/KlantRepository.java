package be.imatex.dao;

import be.imatex.domain.Bestelling;
import be.imatex.domain.Klant;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface KlantRepository extends CrudRepository<Klant, Long > {
    /**
     * The default findById would return Optional<Klant>
     * We want a KLant object as return
     * therefore we override this method
     * @param id
     * @return
     */
    public Klant findById(long id);

    public List<Klant> findAllByOrderByNaam();

    /**
     * @return The Bestelling with the largest id = the most recently added Bestelling
     */
    public Klant findFirstByOrderByKlantnummerDesc();
}
