describe('Contact Form', () => {
    it('Fill in & submit form, assert succes message', async () => {
        await browser.url('/contact');

/*         await $('li=Contact').click();
        await expect(browser).toHaveUrl('https://practice.automationbro.com/contact/') */

        await $('.contact-name input').setValue('Jef Jenkins');
        await $('.contact-email input').setValue('JiffyJen@gmail.com');
        await $('.contact-phone input').setValue('0499875632');
        await $('.contact-message textarea').setValue('Hello World');

        await browser.executeAsync((done) => {
            setTimeout(done, 4000)
        })

        await $('button[type=submit]').click();
        
        const succesEL = await $('[role="alert"]');

        await expect(succesEL).toHaveTextContaining('Thanks for contacting us! We will be in touch with you shortly');
    });
});