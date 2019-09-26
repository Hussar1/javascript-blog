{
  'use strict';

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';


  const titleClickHandler = function() {
    console.log('Link was clicked!');
    console.log('event:', event);
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    console.log('clickedElement: ', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log('clickedElement\'s attribute: ', articleSelector);

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    //console.log('targetArticle: ', targetArticle);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };


  function generateTitleLinks(customSelector = '') {

    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    console.log('Removed contents of titleList.');


    let html = '';

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    // console.log('generateTitleLinks() articles: ', articles);

    for(let article of articles) {

      /* get the article id */
      const articleId = article.getAttribute('id');
      // console.log('articleId: ', articleId);

      /* find the title element, get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      // console.log('articleTitle: ', articleTitle);

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      // console.log('linkHTML: ', linkHTML);

      /* insert link into titleList */
      html = html + linkHTML;
      // console.log('html: ', html);
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    // console.log('links: ', links);

    for(let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();


  function generateTags(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    // console.log('generateTags() articles: ', articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      // console.log('articleTags: ', articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      // console.log('articleTagsArray: ', articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        // console.log('tag: ', tag);
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        // console.log('linkHTML: ', linkHTML);
        /* add generated code to html variable */
        html = html + linkHTML;
        /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
  }

  generateTags();


  function tagClickHandler(event) {
    console.log('Tag was clicked!');
    console.log('event:', event);
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let hrefLink of hrefLinks) {
      /* add class active */
      hrefLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }


  function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  }

  addClickListenersToTags();


  function generateAuthors() {
    // find all articles
    const articles = document.querySelectorAll(optArticleSelector);
    // START LOOP: for every article:
    for (let article of articles) {
      // find author wrapper
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      // make html variable with empty string
      let html = '';
      // get author from data-author attribute
      const articleAuthor = article.getAttribute('data-author');
      console.log('Article author: ', articleAuthor);
      // generate HTML of the link
      const authorLinkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
      // console.log('Author\'s link HTML: ', authorLinkHTML);
      // add generated code to html variable
      html = html + authorLinkHTML;
      // insert HTML of all the links into the author wrapper:
      authorWrapper.innerHTML = html;
      // END LOOP: for every article
    }
  }

  generateAuthors();


  function authorClickHandler(event) {
    console.log('Author was clicked!');
    console.log('authorClickHandler event: ', event);
    // prevent default action for this event
    event.preventDefault();
    // make new constant named "clickedElement" and give it the value of "this"
    const clickedElement = this;
    // make a new constant "href" and read the attribute "href" of the clicked element
    const href = clickedElement.getAttribute('href');
    // make a new constant "author" and extract author from the "href" constant
    const author = href.replace('#author-', '');
    // find all authorLinks with class active
    const activeAuthorLinks = document.querySelectorAll('a.active[href^=#author-');
    // START LOOP: for each activeAuthorLink:
    for (let activeAuthorLink of activeAuthorLinks) {
      // remove class active
      activeAuthorLink.classList.remove('active');
      // END LOOP: for each activeAuthorLink
    }
    // execute function "generateTitleLinks" with article selector as argument
    generateTitleLinks('[data-author="' + author + '"]');
  }


  
}
