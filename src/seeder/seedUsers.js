require("../utils/db-connect");
const { User } = require('../models/user');


module.exports = () => {
  new User({
    tl_id: 642982892,
    first_name: 'Sergey',
    last_name: 'Verkashanskiy',
    username: 'svtype',
    isAdmin: true,
  }).save().catch(err => console.error(err));

   new User({
    tl_id: 180415302,
    first_name: 'Михаил',
    last_name: 'Трошин',
    username: 'mihanick',
    isAdmin: true,
  }).save().catch(err => console.error(err));

  new User({
    tl_id: 1115435792,
    first_name: 'Михаил',
  }).save().catch(err => console.error(err));
 
  new User({
    tl_id: 1183145896,
    first_name: 'Sergey',
  }).save().catch(err => console.error(err));
}
