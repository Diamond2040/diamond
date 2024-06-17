/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const {
  DB,
  COLLECTION
} = require('../migrations/lib');

module.exports = async () => {
  const performers = await DB.collection(COLLECTION.PERFORMER).find().toArray();
  // not good but dont need more query
  for (const performer of performers) {
    const reviews = await DB.collection(COLLECTION.REVIEW).find({ sourceId: performer._id }).toArray();
    const numRates = reviews.reduce((total, review) => total += (review.rating || 0), 0);
    const avg = reviews.length ? Math.round((numRates / reviews.length) * 100) / 100 : 0;
    await DB.collection(COLLECTION.PERFORMER).updateOne({ _id: performer._id }, {
      $set: {
        'stats.totalRates': reviews.length,
        'stats.avgRates': avg,
        'stats.numRates': numRates
      }
    });

    console.log(`Update for: ${performer.username} - avg ${numRates}`);
  }
};
