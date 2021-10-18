class BlogPage{
    open(){
        return browser.url('/blog');
    }

    get linksRecentPosts(){
        return $('#recent-posts-3').$$('li a');
    }
}

export default new BlogPage();