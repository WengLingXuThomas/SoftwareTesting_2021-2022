describe('Add/Remove Elements', () => {

    beforeEach(async () => {
        await browser.url('https://the-internet.herokuapp.com/add_remove_elements/');
    })

    it('Add element', async () => {

        await $('button[onclick="addElement()"]').click();
        await $('button[onclick="addElement()"]').click();

        const deleteButtons = await $('#elements').$$('.added-manually');

        await expect(deleteButtons.length).toEqual(2);
    });

    it('Remove element', async () => {

        await $('button[onclick="addElement()"]').click();
        await $('button[onclick="addElement()"]').click();
        await $('button[onclick="addElement()"]').click();

        let deleteButtons = await $('#elements').$$('.added-manually');

        deleteButtons[0].click();

        deleteButtons = await $('#elements').$$('.added-manually');

        await expect(deleteButtons.length).toEqual(2);
    });
});