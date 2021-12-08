import { Given, When, Then } from '@cucumber/cucumber'



Given(/^I'm on the login page$/, async function (){
    browser.url("http://testphp.vulnweb.com/login.php");
});

When(/^I log in with a default user$/, async function (){
    await $('input[name=uname]').setValue('test');
    await $('input[name=pass]').setValue('test');
    await $('input[type=submit]').click();
});

Then(/^I Shall be on the userinfo page$/, async function (){
    await expect(browser).toHaveUrlContaining('userinfo');  
});