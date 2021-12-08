describe('IFrame', () => {
    it('Working with iframe', async () => {
        //open url
        await browser.url('https://practice.automationbro.com/iframe-sample/');

        //access the iframe
        const iframe = await $('#advanced_iframe');
        await browser.switchToFrame(iframe);

        // verify logo exist
        await expect($('#site-logo')).toExist();

        // switch to parent frame
        await browser.switchToParentFrame();

        // verify page title
        await expect($('h1.tg-page-header__title')).toHaveText('IFrame Sample')

    });
});