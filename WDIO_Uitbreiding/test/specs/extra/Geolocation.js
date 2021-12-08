describe('GeoLocation', () => {
    it('current location', async () => {
        //permissies automatisch gegeven wanneer gevraagd
        await browser.url('https://the-internet.herokuapp.com/geolocation');
        await $('button[onclick="getLocation()"]').click();
   
        const locationInfoEl = $('#demo');
        await expect(locationInfoEl).toHaveTextContaining('Latitude');
        await expect(locationInfoEl).toHaveTextContaining('Longitude');
    })
});