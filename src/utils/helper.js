const { User } = require('../models/user');
const { Config } = require('../models/config');

module.exports = {

  logStart() {
    console.log('>>>>>>>the Bot has been started ...<<<<<<<<<');
  },
  getChatId(msg) {
    return msg.chat.id;
  },
  debug(obj = {}) {
    return JSON.stringify(obj, null, 4);
  },
  debugMD(objects) {
    let result = '';
    // console.log(objects);
    
    objects.forEach(obj => {
      for (let k in obj) {
        result += `*${k}*: ${obj[k]}\n`
      }
      result += '\n'
    });
    return result;
  },
  checkUser: async function checkUser(msg) {
    try {
      let user = await User.findOne({tl_id: msg.from.id});
      
      if (!user) {
        const newUser = new User ({
          tl_id: msg.from.id,
          is_bot: msg.from.is_bot,
          first_name: msg.from.first_name,
          last_name: msg.from.last_name,
          username: msg.from.username
        });
        await newUser.save();
        const config = await Config.findOne();
        config.messageQueue.push({
          tl_id: newUser.tl_id,
          function: 'msgFirstTo',
          date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" ),
          delay: 0
        });
        config.messageQueue.push({
          tl_id: newUser.tl_id,
          function: 'msgSecondTo',
          date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" ),
          delay: 15
        });
        await config.save();
        
        return false;
      }
      if (user.isAdmin) return true;
  
      return false;
    }
    catch (err) { console.error(err.message) };
  },

}
