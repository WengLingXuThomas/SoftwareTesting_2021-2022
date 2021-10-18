import BlogPage from '../pages/blog-page';
 
describe('Blog', () => {
    it('Get list of recent posts, assert textlength is > 10 & assert total list count = 4', async () => {
        await BlogPage.open();
        
        const recentPostsLinks = await BlogPage.linksRecentPosts;
 
        for (const link of recentPostsLinks) {
            await expect((await link.getText()).length).toBeGreaterThan(10);
        }

        await expect(recentPostsLinks).toHaveLength(4);

    });
});