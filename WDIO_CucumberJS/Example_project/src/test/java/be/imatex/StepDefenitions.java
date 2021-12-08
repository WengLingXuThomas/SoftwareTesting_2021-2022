package be.imatex;

import java.util.List;

import cucumber.api.DataTable;
import cucumber.api.PendingException;
import cucumber.api.java.en.*;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


public class StepDefenitions {
    WebDriver driver;


    @Given("^Ik bevind mij op de login pagina$")
    public void Ik_bevind_mij_op_de_login_pagina() throws Throwable {
        System.setProperty("webdriver.gecko.driver", "geckodriver.exe");

        driver = new FirefoxDriver();
        driver.navigate().to("http://localhost:8080/login");
    }

    @When("^Ik \"([^\"]*)\" in het ([^\"]*) veld op geef$")
    public void ik_vul_in_username_veld_in(String enteredText, String fieldName) throws Throwable {
        driver.findElement(By.id(fieldName)).sendKeys(enteredText);
    }

    @When("^Ik druk op de knop Login$")
    public void ik_druk_op_de_knop_login() throws Throwable {
        driver.findElement(By.id("btnLogin")).click();
    }

    @Then("^Zou ik op de home pagina terecht komen$")
    public void zou_ik_op_de_home_pagina_terecht_komen() throws Throwable {
        // wacht tot de juiste pagina geladen is
        new WebDriverWait(driver, 3).until(ExpectedConditions
                .textToBePresentInElementLocated(By.tagName("body"), "Welkom kristof"));

    }

    @When("^Ik druk op de knop bestelling bestaande klant$")
    public void ik_druk_op_de_knop_bestelling_bestaande_klant() throws Throwable {
        driver.findElement(By.id("bestellingNKlant")).click();
    }

    @Then("^Zou ik op de pagina terecht komen waar ik een bestelling kan opnemen voor een bestaande klant$")
    public void kom_ik_terecht_op_pagina_bestelling_bestaande_klant() throws Throwable {
        // wacht tot de juiste pagina geladen is
        new WebDriverWait(driver, 3).until(ExpectedConditions
                .textToBePresentInElementLocated(By.tagName("body"), "Nieuwe bestelling bestaande klant"));

    }

    @Given("^Ik bevind mij op de pagina waar ik een nieuwe bestelling kan toevoegen$")
    public void ik_bevind_mij_op_de_pagina_waar_ik_een_nieuwe_bestelling_kan_toevoegen() throws Throwable {
        System.setProperty("webdriver.gecko.driver", "geckodriver.exe");

        driver = new FirefoxDriver();
        driver.navigate().to("http://localhost:8080/bestelling");
    }

    @When("^Ik \"([^\"]*)\" in het ([^\"]*) veld in geef$")
    public void ik_vul_in_klantnummer_veld_in(String enteredText, String fieldName) throws Throwable {
        driver.findElement(By.id(fieldName)).sendKeys(enteredText);
    }

    @When("^Ik druk op de knop scherm toevoegen$")
    public void ik_druk_op_de_knop_scherm_toevoegen() throws Throwable {
        driver.findElement(By.name("schermToevoegen")).click();
    }

    class LabelData {
        String label;
        String data;
    }

    @Then("^Zou ik het toegevoegde scherm zien in de tabel$")
    public void zou_ik_het_toegevoegde_scherm_zien_in_de_tabel(List<LabelData> checklist) throws Throwable {
        String tableText = driver.findElement(By.id("tableSchermen")).getText();
        for (LabelData ld: checklist){
            String text2bFound = ld.data;
            Assert.assertTrue("Did not find this text: "+text2bFound+"\n",tableText.contains(text2bFound));
        }
    }

    @When("^Ik druk op de knop bestelling bevestigen$")
    public void ik_druk_op_de_knop_bestelling_bevestigen() throws Throwable {
        driver.findElement(By.name("submit")).click();
    }

    @Then("^Zou ik op de succes pagina terecht komen$")
    public void zou_ik_op_de_succes_pagina_terecht_komen() throws Throwable {
        // wacht tot de juiste pagina geladen is
        new WebDriverWait(driver, 3).until(ExpectedConditions
                .textToBePresentInElementLocated(By.tagName("body"), "succesvol"));

    }

    @Then("^Ik sluit de browser$")
    public void ik_sluit_de_browser() throws Throwable {
        driver.quit();
    }


}
