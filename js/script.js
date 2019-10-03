{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML)
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
    // console.log('event:', event);
    event.preventDefault();
    const clickedElement = this;
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    // console.log('clickedElement: ', clickedElement);
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
    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML = '';
    console.log('Removed contents of titleList.');

    let html = '';
    /* for each article */
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);
    // console.log('generateTitleLinks() articles: ', articles);
    for(let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');
      // console.log('articleId: ', articleId);
      /* find the title element, get the title from the title element */
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
      // console.log('articleTitle: ', articleTitle);
      /* create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
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


  function calculateTagsParams(tags) {
    const params = {max : 0, min : 999999};
    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
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
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);
    // console.log('generateTags() articles: ', articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);
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
        //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        const linkHTMLData = {tag: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        // console.log('linkHTML: ', linkHTML);
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opt.tagsListSelector);
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagParams:', tagsParams);
    // [NEW] create variable for all links HTML code
    let allTagsHTML = '';
    // [NEW] START LOOP: for each tagin allTags:
    for(let tag in allTags) {
      const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';
      console.log('tagLinkHTML:', tagLinkHTML);
      // [NEW] generate code of a link and add it to allTagsHTML
      allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li> ';
      // [NEW] END LOOP: for each tag in allTags
    }
    // [NEW] add html from allTagsHTML to tagList
    tagList.innerHTML = allTagsHTML;
  }

  generateTags();


  function tagClickHandler(event) {
    console.log('Tag was clicked!');
    // console.log('event:', event);
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
    let allAuthors = {};
    // find all articles
    const articles = document.querySelectorAll(opt.articleSelector);
    // START LOOP: for every article:
    for (let article of articles) {
      // find author wrapper
      const authorWrapper = article.querySelector(opt.articleAuthorSelector);
      // make html variable with empty string
      let html = '';
      // get author from data-author attribute
      const articleAuthor = article.getAttribute('data-author');
      // console.log('Article author: ', articleAuthor);
      // generate HTML of the link
      const authorLinkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
      // console.log('Author\'s link HTML: ', authorLinkHTML);
      // add generated code to html variable
      html = html + authorLinkHTML;
      // insert HTML of all the links into the author wrapper:
      authorWrapper.innerHTML = html;
      // END LOOP: for every article
      if(!allAuthors.hasOwnProperty(articleAuthor)) {
        /* [NEW] add tag to allTags object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
    }
    console.log('allAuthores', allAuthors);
    const authorList = document.querySelector(opt.authorListSelector);
    let allAuthorsHTML = '';
    for (let author in allAuthors) {
      allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + '</a></li>';
    }
    authorList.innerHTML = allAuthorsHTML;
  }

  generateAuthors();


  function authorClickHandler(event) {
    console.log('Author was clicked!');
    // console.log('authorClickHandler event: ', event);
    // prevent default action for this event
    event.preventDefault();
    // make new constant named "clickedElement" and give it the value of "this"
    const clickedElement = this;
    // make a new constant "href" and read the attribute "href" of the clicked element
    const href = clickedElement.getAttribute('href');
    // make a new constant "author" and extract author from the "href" constant
    const author = href.replace('#author-', '');
    // find all authorLinks with class active
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"');
    // START LOOP: for each activeAuthorLink:
    for (let activeAuthorLink of activeAuthorLinks) {
      // remove class active
      activeAuthorLink.classList.remove('active');
      // END LOOP: for each activeAuthorLink
    }
    // execute function "generateTitleLinks" with article selector as argument
    generateTitleLinks('[data-author="' + author + '"]');
  }


  function addClickListenersToAuthors() {
    // find all links to authors
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    // START LOOP: for each authorLink:
    for (let authorLink of authorLinks) {
      // add authorClickHandler as event listener for that link
      authorLink.addEventListener('click', authorClickHandler);
      // END LOOP: for each authorLink
    }
  }

  addClickListenersToAuthors();
}
