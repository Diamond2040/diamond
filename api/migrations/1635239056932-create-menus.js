const { readFileSync } = require('fs');
const { join } = require('path');
const { replace } = require('lodash');
const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const regExp = /\[\[DOMAIN\]\]/g;
  const page2257 = readFileSync(
    join(__dirname, 'content', '2257.html')
  ).toString();
  const pageDMCA = readFileSync(
    join(__dirname, 'content', 'dmca.html')
  ).toString();
  const pageToS = readFileSync(
    join(__dirname, 'content', 'tos.html')
  ).toString();
  const privacy = readFileSync(
    join(__dirname, 'content', 'privacy_policy.html')
  ).toString();

  const [
    page2257Content,
    pageDMCAContent,
    pageToSContent,
    privacyContent
  ] = await Promise.all([
    replace(page2257, regExp, process.env.DOMAIN),
    replace(pageDMCA, regExp, process.env.DOMAIN),
    replace(pageToS, regExp, process.env.DOMAIN),
    replace(privacy, regExp, process.env.DOMAIN)
  ]);

  const KEYS = {
    TOS: 'terms-of-service',
    USC2257: 'u.s.c-2257',
    DMCA: 'dmca',
    PRIVACY: 'privacy-policy'
  };

  const footer1Pages = [
    {
      title: 'Terms of Service',
      type: 'post',
      status: 'published',
      authorId: null,
      shortDescription: 'Terms of service',
      content: pageToSContent,
      slug: KEYS.TOS
    },
    {
      title: 'Privacy & Policy',
      type: 'post',
      status: 'published',
      authorId: null,
      shortDescription: 'Privacy and Policy',
      content: privacyContent,
      slug: KEYS.PRIVACY
    },
    {
      title: 'U.S.C 2257',
      type: 'post',
      status: 'published',
      authorId: null,
      shortDescription: 'USC2257',
      content: page2257Content,
      slug: KEYS.USC2257
    },
    {
      title: 'DMCA',
      type: 'post',
      status: 'published',
      authorId: null,
      shortDescription: 'DMCA',
      content: pageDMCAContent,
      slug: KEYS.DMCA
    }
  ];

  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: false,
    parentId: null,
    path: null,
    section: 'footer1',
    title: 'Legal',
    help: '',
    ordering: 0,
    type: 'title'
  });

  let ordering = 1;
  await footer1Pages.reduce(async (previousPromise, p) => {
    await previousPromise;

    const post = await DB.collection(
      COLLECTION.POST
    ).findOne({
      slug: p.slug
    });
    if (!post) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection(
        COLLECTION.POST
      ).insertOne({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      // eslint-disable-next-line no-console
      console.log(
        `Created post ${p.title}`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `Post ${p.title} existed!`
      );
    }

    // eslint-disable-next-line no-await-in-loop
    await DB.collection(
      COLLECTION.MENU
    ).insertOne({
      internal: false,
      isNewTab: false,
      parentId: null,
      path: `/page/${p.slug}`,
      section: 'footer1',
      title: p.title,
      help: '',
      ordering,
      type: 'link'
    });

    ordering += 1;
  }, Promise.resolve());

  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: false,
    parentId: null,
    path: null,
    section: 'footer2',
    title: 'Resources',
    help: '',
    ordering: 0,
    type: 'title'
  });
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: true,
    isNewTab: false,
    parentId: null,
    path: '/contact',
    section: 'footer2',
    title: 'Contact Us',
    help: '',
    ordering: 1,
    type: 'link'
  });

  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: false,
    parentId: null,
    path: null,
    section: 'footer3',
    title: 'Socials',
    help: '',
    ordering: 0,
    type: 'title'
  });
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: true,
    parentId: null,
    path: 'https://twitter.com',
    section: 'footer3',
    title: 'Twitter',
    help: '',
    ordering: 1,
    icon: 'twitter',
    type: 'link'
  });
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: true,
    parentId: null,
    path: 'https://facebook.com',
    section: 'footer3',
    title: 'Facebook',
    help: '',
    ordering: 1,
    icon: 'facebook',
    type: 'link'
  });
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: true,
    parentId: null,
    path: 'https://google.com',
    section: 'footer3',
    title: 'Google',
    help: '',
    ordering: 1,
    icon: 'google',
    type: 'link'
  });

  // header menus
  // home
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: true,
    parentId: null,
    path: '/',
    section: 'header',
    title: 'Home',
    help: '',
    ordering: 0,
    type: 'link'
  });
  const categories = await DB.collection(COLLECTION.CATEGORIES).find({}).toArray();
  ordering = 1;
  await categories.reduce(async (pP, category) => {
    await pP;

    const menu = await DB.collection(COLLECTION.MENU).findOne({
      section: 'header',
      title: category.name
    });
    if (!menu) {
      await DB.collection(COLLECTION.MENU).insertOne({
        internal: false,
        isNewTab: true,
        parentId: null,
        path: `/category/${category.slug}`,
        section: 'header',
        title: category.name,
        help: '',
        ordering
      });
    }

    ordering += 1;
  }, Promise.resolve());

  ordering += 1;
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: false,
    isNewTab: false,
    parentId: null,
    path: '/search',
    section: 'header',
    title: 'Search',
    help: '',
    ordering,
    icon: 'search'
  });

  ordering += 1;
  await DB.collection(COLLECTION.MENU).insertOne({
    internal: true,
    isNewTab: false,
    parentId: null,
    path: '/auth/login',
    section: 'header',
    title: 'Login',
    help: '',
    ordering,
    icon: 'login',
    hideLoggedIn: true
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
