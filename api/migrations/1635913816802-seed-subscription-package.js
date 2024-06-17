const {
  DB, COLLECTION
} = require('./lib');

module.exports.up = async function up(next) {
  const packages = [
    {
      ordering: 0,
      type: 'recurring',
      initialPeriod: 30,
      recurringPrice: 10,
      recurringPeriod: 30,
      isActive: true,
      name: 'Monthly subscription',
      price: 10,
      description: '',
      __v: 0
    },
    {
      ordering: 1,
      type: 'single',
      initialPeriod: 30,
      recurringPrice: 0,
      recurringPeriod: 0,
      isActive: true,
      name: '1 Month',
      price: 20,
      description: '',
      __v: 0
    }
  ];

  await packages.reduce(async (lp, subPackage) => {
    await lp;

    return DB.collection(COLLECTION.SUBSCRIPTION_PACKAGES).insertOne({
      ...subPackage,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }, Promise.resolve());

  next();
};

module.exports.down = function down(next) {
  next();
};
