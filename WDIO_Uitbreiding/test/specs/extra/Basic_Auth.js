describe('Basic Auth', () => {
    it('Credentials passed in url', async () => {
        const credentials = {
            user: 'admin', 
            password: 'admin'
        }
        await browser.url(`http://${credentials.user}:${credentials.password}@the-internet.herokuapp.com/basic_auth`)
        const messageEl = await $('div[class="example"] p');
        await expect(messageEl).toHaveTextContaining('Congratulations!');
    });
});