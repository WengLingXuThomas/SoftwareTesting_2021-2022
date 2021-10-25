import ContactPage from '../pages/contact-page';
import * as faker from 'faker';

describe('Contact Form', () => {
    it('Fill in & submit form, assert succes message', async () => {
        await ContactPage.open();

/*         await $('li=Contact').click();
        await expect(browser).toHaveUrl('https://practice.automationbro.com/contact/') */

        //Static data
        //await ContactPage.submitForm('Jef Jenkins','iffyJen@gmail.com','0499875632','Hello World');

        //Random data generated using the faker.js library
        await ContactPage.submitForm(faker.name.findName(),faker.internet.email(),faker.phone.phoneNumber(),faker.lorem.paragraphs(2));

      /*   await browser.executeAsync((done) => {
            setTimeout(done, 4000)
        }) */

        //await browser.debug();
    
        const succesEL = await ContactPage.alertEl;

        await expect(succesEL).toHaveTextContaining('Thanks for contacting us! We will be in touch with you shortly');
    });
});