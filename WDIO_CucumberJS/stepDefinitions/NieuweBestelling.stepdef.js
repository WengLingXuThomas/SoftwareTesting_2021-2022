import { Given, When, Then, And } from '@cucumber/cucumber'

Given(/^Ik bevind mij op de login pagina$/,async function (){
    browser.url("http://localhost:8080/login");
});

When(/^Ik "([^"]*)" in het ([^"]*) veld op geef$/, async function (enteredText, fieldName){
    await $(`#${fieldName}`).setValue(enteredText);
});

When(/^Ik druk op de knop Login$/, async function (){
    await $('#btnLogin').click();
});

Then(/^Zou ik op de home pagina terecht komen$/, async function (){
    await browser.waitUntil(
        async () => (await $('h4').getText()) === 'Welkom kristof',
        {
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        }
    );
});

When(/^Ik druk op de knop bestelling bestaande klant$/, async function (){
    await $('#bestellingNKlant').click();
});

Then(/^Zou ik op de pagina terecht komen waar ik een bestelling kan opnemen voor een bestaande klant$/, async function (){
    await browser.waitUntil(
        async () => (await $('h4').getText()) === 'Nieuwe bestelling bestaande klant',
        {
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        }
    );
});

When(/^Ik \"([^\"]*)\" in het ([^\"]*) veld in geef$/, async function (enteredText,fieldName){
    await $(`[name="${fieldName}"]`).setValue(enteredText);
});

When(/^Ik druk op de knop scherm toevoegen$/, async function (){
    await $('button[name=schermToevoegen]').click();
});

Then(/^Zou ik het toegevoegde scherm zien in de tabel$/, async function (table){
    let tableText = await $('#tableSchermen');
    // console.log(table.hashes());

    for (const row of table.hashes()) {
        let text2bFound = row.data;
        await expect(tableText).toHaveTextContaining(text2bFound)
    }
    await browser.pause(3500);
});

When(/^Ik druk op de knop bestelling bevestigen$/, async function (){
    await $('button[name=submit]').click();
});


Then(/^Zou ik op de succes pagina terecht komen$/, async function (){
    await browser.waitUntil(
        async () => (await $('[role="alert"]').getText()) === 'Bestelling succesvol opgenomen',
        {
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        }
    );
    await browser.pause(2000);
});

