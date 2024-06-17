/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { readdirSync } = require('fs');
const { readFileSync } = require('fs');
const { join, parse } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'src', 'templates', 'emails');

const templateMap = {
  'admin-payment-success': {
    name: 'Admin payment success',
    subject: 'New payment success',
    desc: 'Notification email will be sent to admin after payment successful'
  },
  contact: {
    name: 'Contact email',
    subject: 'New contact',
    desc: 'Notification email will be sent to admin from contact page'
  },
  'email-verification': {
    name: 'Email verification',
    subject: 'Verify your email address',
    desc: 'Email will be sent to user to verify their email address'
  },
  forgot: {
    name: 'Recover password',
    subject: 'Recover password',
    desc: 'Email will be sent to reset user password'
  },
  'update-order-status': {
    name: 'Order status change',
    subject: 'Order Status Changed',
    desc: 'Email notification to user when performer updates order status'
  },
  'user-payment-success': {
    name: 'Payment success to user',
    subject: 'New payment success',
    desc: 'Email to user after user purchased website products'
  },
  'contact-performer': {
    name: 'Get in touch performer',
    subject: 'You have a new message',
    desc: 'Email to escort after user submits get in touch form'
  }
};

module.exports.up = async function up(next) {
  const files = readdirSync(TEMPLATE_DIR).filter((f) => f.includes('.html'));
  for (const file of files) {
    const content = readFileSync(join(TEMPLATE_DIR, file)).toString();
    const key = parse(file).name;
    const exist = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({ key });
    if (!exist) {
      await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
        key,
        content,
        subject: templateMap[key] ? templateMap[key].subject : null,
        name: templateMap[key] ? templateMap[key].name : key,
        description: templateMap[key] ? templateMap[key].desc : 'N/A',
        layout: 'layouts/default',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  // layout file
  const defaultLayout = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({
    key: 'layouts/default'
  });
  if (!defaultLayout) {
    const layoutFile = readFileSync(join(TEMPLATE_DIR, 'layouts/default.html')).toString();
    await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
      key: 'layouts/default',
      content: layoutFile,
      name: 'Default layout',
      description: 'Default layout, template content will be replaced by [[BODY]]',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
