// import Routes from 'next-routes';
const routes = require('next-routes');

/**
 * routes.add([name], pattern = /name, page = name)
   routes.add(object)
 */

export default routes()
  .add('home', '/', '/home')
  .add('video', '/video/:id', '/video/detail')
  .add('store', '/store/:id', '/store')
  .add('gallery', '/gallery/:id', '/gallery/details')
  .add('page', '/page/:id', '/page')
  .add('search', '/search', '/search')
  .add('model-schedule', '/model/schedule', '/model/schedule')
  .add('model-bookings', '/model/bookings', '/model/bookings')
  .add('model-payment-history', '/model/payment-history', '/model/payment-history')
  .add('model', '/model/:id', '/model/profile')
  .add('category', '/category/:id', '/search/category')
  .add('register', '/auth/register', '/auth/user-register');
