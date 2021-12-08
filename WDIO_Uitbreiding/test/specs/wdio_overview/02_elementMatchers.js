describe('Element Matchers', () => {
    
    //Calls isDisplayed on given element.
    it('toBeDisplayed', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        const elem = await $('.heading');
        await expect(elem).toBeDisplayed();
    });

    //Calls isExisting on given element.
    it('toExist', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        const elem = await $('h2');
        await expect(elem).toExist();
    });

    //Same as toExist.
    it('toBePresent', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        const elem = await $('a[href="/abtest"]')
        await expect(elem).toBePresent();
    });

    //Checks if element has focus. This assertion only works in a web context.
    it('toBeFocused', async () => {
        await browser.url('https://the-internet.herokuapp.com/add_remove_elements/');
        const elem = await $('button[onclick="addElement()"]');
        await elem.click();
        await expect(elem).toBeFocused();
    });


    //Checks if an element has a certain attribute with a specific value.
    it('toHaveAttribute', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        const elem = await $('h1')
        await expect(elem).toHaveAttribute('class', 'heading');
    });


    //...

});