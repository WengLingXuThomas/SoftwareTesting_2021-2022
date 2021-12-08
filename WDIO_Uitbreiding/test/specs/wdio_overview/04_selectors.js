describe('Selectors', () => {
    
    it('id selector', async () => {
        await browser.url('https://the-internet.herokuapp.com/');

        const elem = await $('#content');

        await expect(elem).toExist();
    });

    it('class selector', async () => {
        await browser.url('https://the-internet.herokuapp.com/');

        const elem = await $('.heading');

        await expect(elem).toExist();
    });

    it('by attribute selector', async () => {
        await browser.url('https://the-internet.herokuapp.com/');

        const elem = await $('[href="/dynamic_content"]');

        await expect(elem).toExist();
    });

    it('tag selector', async () => {
        await browser.url('https://the-internet.herokuapp.com/');

        const elem = await $('h1');

        await expect(elem).toExist();
    });

    it('Xpath selector', async () => {
        await browser.url('https://the-internet.herokuapp.com/checkboxes');

        const elem = await $("//input[@type='checkbox']");

        await expect(elem).toExist();
    });

    



});