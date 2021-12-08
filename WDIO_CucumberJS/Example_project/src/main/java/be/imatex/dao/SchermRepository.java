package be.imatex.dao;
import be.imatex.domain.Scherm;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.Repository;

public interface SchermRepository extends CrudRepository<Scherm, Integer > {
    Scherm findByStatus(String status);
    /**
     * The default findById would return Optional<Scherm>
     * We want a Scherm object as return
     * therefore we override this method
     * @param id
     * @return
     */
    public Scherm findById(long id);
    /**
     * @return The scherm with the largest id = the most recently added scherm
     */
    public Scherm findFirstByOrderByIdDesc();
    /**
     * @return Returns the number of entities available.
     */
    public long count();
}
