package be.imatex.dao;

import be.imatex.domain.Bestelling;
import org.springframework.data.repository.CrudRepository;


public interface BestellingRepository extends CrudRepository<Bestelling, Long > {

    /**
     * The default findById would return Optional<Bestelling>
     * We want a Bestelling object as return
     * therefore we override this method
     * @param id
     * @return
     */
    public Bestelling findById(long id);

    /**
     * @return The Bestelling with the largest id = the most recently added Bestelling
     */
    public Bestelling findFirstByOrderByIdDesc();

    /**
     * @return Returns the number of entities available.
    */
    public long count();


}
