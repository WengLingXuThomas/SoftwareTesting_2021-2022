package be.imatex.service;

import be.imatex.domain.Scherm;

import java.util.List;

public interface SchermService {
    /**
     * Test
     * */
    //public Iterable<Scherm> alleSchermenByStatus();
    //public ArrayList<Scherm> alleSchermenByStatus(String status);
    public Iterable<Scherm> alleSchermenByStatus();
    public List<Scherm> geefActieveSchermen();
    //public List<Scherm> geefSchermenByBestelling(int id);

}
