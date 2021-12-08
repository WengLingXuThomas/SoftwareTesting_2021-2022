package be.imatex;

import be.imatex.service.SchermServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ImatexApplication {

    public static void main(String[] args) {
        SpringApplication.run(ImatexApplication.class, args);
    }
        @Autowired
        SchermServiceImpl schermServiceImpl;
}
