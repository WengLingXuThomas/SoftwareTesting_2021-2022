describe('Blog', () => {
    it('Get list of recent posts, assert textlength is > 10 & assert total list count = 4', async () => {
        await browser.url('/blog');

        const recentPostsLinks = await $('#recent-posts-3').$$('li a');
 
        for (const link of recentPostsLinks) {
            await expect((await link.getText()).length).toBeGreaterThan(10);
        }

        await expect(recentPostsLinks).toHaveLength(4);

    });
});