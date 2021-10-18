import HomePage from '../pages/home-page';
import allureReporter from '@wdio/allure-reporter';

describe('Navigation Menu', () => {
    it('Get the text of all menu items & assert them', async () => {
        allureReporter.addFeature("Navigation");
        allureReporter.addSeverity("critical");

        // use base url in wdio configuration
        await HomePage.open();

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
        const navLinks = await HomePage.NavComponent.linksNavMenu;

        for (const link of navLinks) {
            actualLinks.push(await link.getText());
        }

        await expect(expectedLinks).toEqual(actualLinks);

      
    });
});

describe('Navigation Menu', () => {
    it.only('Get the text of all menu items & assert them - using wait commands', async () => {
        //hardcoded timeout
        //browser.pause(1000);

        // use base url in wdio configuration
        await HomePage.open();

        const expectedLinks = [
            "Home",
            "About",
            "Shop",
            "Blog",
            "Contact",
            "My account",
        ];

        const actualLinks = [];

        await $('#primary-menu li').waitForClickable({timeout: 1000});
        //await $('#primary-menu').waitForDisplayed({timeout: 1000});

        //wait until te "Home" text is displayed in the navigation menu
        await browser.waitUntil(async function () {
            const homeText = await HomePage.NavComponent.firstNavMenuList.getText();
            return homeText === "Home";
        }, {
            timeout:5000,
            timeoutMsg:'Could not verify the "Home" text from #primary-menu li'
        })

        const navLinks = await HomePage.NavComponent.linksNavMenu;

        for (const link of navLinks) {
            actualLinks.push(await link.getText());
        }

        await expect(actualLinks).toEqual(expectedLinks);

      
    });
});