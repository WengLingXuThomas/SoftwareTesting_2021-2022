describe('Browser Matchers', () => {

    before( async () =>{
        //Options -> waitforTimeout and waitforInterval default in config
        require('expect-webdriverio').setOptions({ wait: 5000 })
    })
    
    //Checks if browser is on a specific page.
    it('toHaveUrl', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        await expect(browser).toHaveUrl('https://the-internet.herokuapp.com/')
    });

    //Checks if browser is on a page URL that contains a value.
    it('toHaveUrlContaining', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        await expect(browser).toHaveUrlContaining('the-internet');
    });

    //Checks if website has a specific title in head tag.
    it('toHaveTitle', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        await expect(browser).toHaveTitle('The Internet')
    });

    //Checks if website has a specific title that contains a value in head tag.
    it('toHaveTitleContaining', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        await expect(browser).toHaveTitleContaining('Internet')
    });
});