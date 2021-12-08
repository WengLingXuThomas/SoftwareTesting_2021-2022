describe('Broken Images', () => {
    it('find broken images', async () => {
        await browser.url('https://the-internet.herokuapp.com/broken_images')

        const images = await $$('div[class="example"] img');

        const imgUrl = [];

        for (let i = 0; i < images.length; i++) {
            let imgFullUrl = `https://the-internet.herokuapp.com/${await images[i].getAttribute("src")}`;
            imgUrl.push(imgFullUrl);      
        }

        if (imgUrl.length > 0) {
            for (const url of imgUrl) {
                await browser.url(url);
                const statusEl = await $('h1');
                await expect(statusEl).toHaveTextContaining('Not Found');
                break;
            }
        }
    });
});