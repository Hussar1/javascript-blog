{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
    allAuthorsLink: Handlebars.compile(document.querySelector('#template-allAuthors-link').innerHTML)
  };

  const opt = {
    articleSelector : '.post',
    titleSelector : '.post-title',
    titleListSelector : '.titles',
    articleTagsSelector : '.post-tags .list',
    articleAuthorSelector : '.post-author',
    tagsListSelector : '.tags.list',
    cloudClassCount : '5',
    cloudClassPrefix : 'tag-size-',
    authorListSelector : '.list.authors'
  };

  const titleClickHandler = function() {
    console.log('Link was clicked!');
    event.preventDefault();
    const clickedElement = this;
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    clickedElement.classList.add('active');
    const activeArticles = document.querySelectorAll('.posts .active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    const articleSelector = clickedElement.getAttribute('href');
    console.log('clickedElement\'s attribute: ', articleSelector);
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add('active');
  };


  function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML = '';
    console.log('Removed contents of titleList.');

    let html = '';
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);
    for(let article of articles) {
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      html = html + linkHTML;
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for(let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();


  function calculateTagsParams(tags) {
    const params = {max : 0, min : 999999};
    for (let tag in tags) {
      if (tags[tag] > params.max){
        params.max = tags[tag];
      }
      if (tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  }


  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1 );
    return opt.cloudClassPrefix + classNumber;
  }


  function generateTags(){
    let allTags = {};
    const articles = document.querySelectorAll(opt.articleSelector);
    for (let article of articles) {
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');
      for (let tag of articleTagsArray) {
        const linkHTMLData = {tag: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        html = html + linkHTML;
        if(!allTags.hasOwnProperty(tag)) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      tagsWrapper.innerHTML = html;
    }
    const tagList = document.querySelector(opt.tagsListSelector);
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};
    for(let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }

  generateTags();


  function tagClickHandler(event) {
    console.log('Tag was clicked!');
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    for (let activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');
    }
    const hrefLinks = document.querySelectorAll('a[href="' + href + '"]');
    for (let hrefLink of hrefLinks) {
      hrefLink.classList.add('active');
    }
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }


  function addClickListenersToTags() {
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    for (let tagLink of tagLinks) {
      tagLink.addEventListener('click', tagClickHandler);
    }
  }

  addClickListenersToTags();


  function generateAuthors() {
    let allAuthors = {};
    const articles = document.querySelectorAll(opt.articleSelector);
    for (let article of articles) {
      const authorWrapper = article.querySelector(opt.articleAuthorSelector);
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      const linkHTMLData = {author: articleAuthor};
      const authorLinkHTML = templates.authorLink(linkHTMLData);
      html = html + authorLinkHTML;
      authorWrapper.innerHTML = html;
      if(!allAuthors.hasOwnProperty(articleAuthor)) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
    }
    const authorList = document.querySelector(opt.authorListSelector);
    const allAuthorsData = {authors: []};
    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author
      });
    }
    authorList.innerHTML = templates.allAuthorsLink(allAuthorsData);
  }

  generateAuthors();


  function authorClickHandler(event) {
    console.log('Author was clicked!');
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"');
    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  }


  function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for (let authorLink of authorLinks) {
      authorLink.addEventListener('click', authorClickHandler);
    }
  }

  addClickListenersToAuthors();
}
