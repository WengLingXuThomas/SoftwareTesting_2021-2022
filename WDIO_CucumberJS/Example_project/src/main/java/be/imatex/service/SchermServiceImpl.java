package be.imatex.service;
import be.imatex.dao.SchermRepository;
import be.imatex.domain.Scherm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service //foutmelding
public class SchermServiceImpl implements SchermService{
    @Autowired
    SchermRepository schermRepository;
    @Override
    public Iterable<Scherm> alleSchermenByStatus() {
            schermRepository.findAll();
            Iterable<Scherm> actieveSchermen = schermRepository.findAll();
            return actieveSchermen;
    }
    @Override
    public List<Scherm> geefActieveSchermen() {

        List<Scherm> actieveSchermen = new ArrayList<>();
        //schermRepository.findAll().forEach(schermen::add);
        for(Scherm scherm:schermRepository.findAll()) {
            if(scherm.status.contains("Actief")) {
                actieveSchermen.add(scherm);
            }
        }
        //Iterable<Scherm> actieveSchermen = schermRepository.findAll();
        return actieveSchermen;
    }
    /*
    @Override
    public List<Scherm> geefSchermenByBestelling(int id) {

        List<Scherm> bijhorendeSchermen = new ArrayList<>();
        //schermRepository.findAll().forEach(schermen::add);
        for(Scherm scherm:schermRepository.findAll()) {
            if(scherm.getBestellingsnummer() == id) {
                bijhorendeSchermen.add(scherm);
            }
        }
        //Iterable<Scherm> actieveSchermen = schermRepository.findAll();
        return bijhorendeSchermen;
    }
*/
}
