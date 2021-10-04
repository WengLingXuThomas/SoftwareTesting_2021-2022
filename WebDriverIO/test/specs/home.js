//Practice E-Commerce Site – Automation Bro
//https://practice.automationbro.com/

//#Test1
describe('Home', () =>{
    it('Open URL & assert title', async () => {
        //Open url
        await browser.url('https://practice.automationbro.com/')

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
        //Open Home Page
        await browser.url('https://practice.automationbro.com');

        //Locate & click get started button
        await $('#get-started').click();

        // Assert url
        await expect(browser).toHaveUrlContaining('get-started');
    });

       
    it('Click page logo & assert url does not contains get-started text', async () => {
        //Open Home Page
        await browser.url('https://practice.automationbro.com');
     
        //locate & click logo
        //await $('//body/div[1]/header/div/div/div/div/a').click();
        await $('//img[@alt="Practice E-Commerce Site"]').click();

        // Assert url does not contains get-started text
        await expect(browser).not.toHaveUrlContaining('get-started');
    });
       
    it('Find heading element & assert text', async () => {
        //Open Home Page
        await browser.url('https://practice.automationbro.com');
     
        //locate heading element
        const headingEl = await $('.elementor-widget-container h1');

/*         //get the text
        const headingText = await headingEl.getText();

        //Assert the text
        await expect(headingText).toEqual('Think different. Make different.') */

        // webdriver IO helper function
        await expect(headingEl).toHaveText('Think different. Make different.')
    });

    
});

