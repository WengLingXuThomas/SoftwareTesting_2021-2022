describe('Navigation Menu', () => {
    it('Get the text of all menu items & assert them', async () => {
        // use base url in wdio configuration
        await browser.url('/');

        const expectedLinks = [
            "Home",
            "About",
            "Shop",
            "Blog",
            "Contact",
            "My account",
        ];

        const actualLinks = [];

        //#primary-menu li[id*=menu]
        //const navLinks = await $('#primary-menu').$$('li[id*=menu]')
        const navLinks = await $$('#primary-menu li[id*=menu]')

        for (const link of navLinks) {
            actualLinks.push(await link.getText());
        }

        await expect(expectedLinks).toEqual(actualLinks);

      
    });
});