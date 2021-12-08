describe('Hooks', () => {

    before(function () {
        console.log("Run once before the first test in this block")
    })

    after(function () {
        console.log("Run once after the last test in this block")
    })

    beforeEach(function () {
        console.log("Runs before each test in this block")
    })

    
    afterEach(function () {
        console.log("Runs after each test in this block")
    })


    it('Test1', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        await expect(browser).toHaveUrl('https://the-internet.herokuapp.com/')
    });

    it('Test2', async () => {
        await browser.url('https://practice.automationbro.com/');
        await expect(browser).toHaveUrl('https://practice.automationbro.com/')
    });

    it('Test3', async () => {
        await browser.url('https://the-internet.herokuapp.com/');
        await expect(browser).toHaveUrl('https://the-internet.herokuapp.com/')
    });
});