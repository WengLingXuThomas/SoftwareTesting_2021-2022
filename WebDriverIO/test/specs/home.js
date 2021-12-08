import HomePage from '../pages/home-page';
import allureReporter from '@wdio/allure-reporter';

//#Test1
describe('Home', () =>{

 /*    before( async () =>{
        console.log('THIS COULD BE USED FOR TEST SETUP')
    }) */

    beforeEach(async () =>{
        console.log('THIS RUNS BEFORE EACH TEST')
        
        //Open url
        await HomePage.open();
    })

/*     after( async () =>{
        console.log('THIS COULD BE USED FOR TEST CLEANUP')
    })

    afterEach(async () =>{
        console.log('THIS RUNS AFTER EACH TEST')
        
    }) */

    it('Open URL & assert title', async () => {
        allureReporter.addSeverity("minor");
        // Assert title
        await expect(browser).toHaveTitle('Practice E-Commerce Site – Automation Bro');
    });

    it('Open About page & assert url', async () => {
        //Open url
        await browser.url('https://practice.automationbro.com/about')

        // Assert url
        await expect(browser).toHaveUrl('https://practice.automationbro.com/about/')
    });

    
    it('Open Home page & click get started btn & assert url contains get-started text', async () => {

        //Locate & click get started button
        await HomePage.btnGetStarted.click();

        // Assert url
        await expect(browser).toHaveUrlContaining('get-started');
    });

       
    it('Click page logo & assert url does not contains get-started text', async () => {
        allureReporter.addFeature("Logo verification");
     
        //locate & click logo
        //await $('//img[@alt="Practice E-Commerce Site"]').click();
        await HomePage.imageLogo.click();

        // Assert url does not contains get-started text
        await expect(browser).not.toHaveUrlContaining('get-started');
    });
       
    it('Find heading element & assert text', async () => {
     
        //locate heading element
        const headingEl = await HomePage.txtHeading

/*         //get the text
        const headingText = await headingEl.getText();

        //Assert the text
        await expect(headingText).toEqual('Think different. Make different.') */

        // webdriver IO helper function
        await expect(headingEl).toHaveText('Think different. Make different.')
    });

    
});

