const { DB, COLLECTION } = require('./lib');

const CATEGORIES = [
  {
    group: 'performer',
    name: 'Trans',
    slug: 'trans',
    ordering: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    group: 'performer',
    name: 'DBSM',
    slug: 'bdsm',
    ordering: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    group: 'performer',
    name: 'Fetish',
    slug: 'fetish ',
    ordering: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    group: 'performer',
    name: 'Dancers',
    slug: 'dancers',
    ordering: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    group: 'performer',
    name: 'Affairs',
    slug: 'affairs',
    ordering: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports.up = async function up(next) {
  await CATEGORIES.reduce(async (oldPromise, val) => {
    await oldPromise;

    const exists = await DB.collection(COLLECTION.CATEGORIES).findOne({
      slug: val.slug
    });
    if (!exists) {
      return DB.collection(COLLECTION.CATEGORIES).insertOne({
        ...val
      });
    }
    return Promise.resolve();
  }, Promise.resolve());

  next();
};

module.exports.down = function down(next) {
  next();
};
