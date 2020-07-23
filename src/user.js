const { getChatId, checkUser, debug, debugMD } = require('./utils/helper');
const kbi = require('./utils/keyboard_inline-buttons');
const kb = require('./utils/keyboard-buttons');
const keyboard = require('./utils/keyboard');
const { User } = require('./models/user');
const { Post } = require('./models/post');
const { Config } = require('./models/config');


module.exports = (bot) => {

  bot.on('message', async (msg) => {
    console.log('Working', msg.from.first_name);
    // console.log(msg);

    try {
      let users, posts, text, config;

      switch (msg.text) {
        case kb.profile.request:
          break;
        case kb.profile.services:
          break;
        case kb.profile.mode:
          break;
        case kb.profile.dana:
          text = '*Список подписчиков:*\n';
          bot.sendMessage(getChatId(msg), text, {
            reply_markup: { keyboard: keyboard.users, resize_keyboard: true },
            parse_mode: 'Markdown'
          });
          break;
        case kb.profile.about:
          break;
      }
    }
    catch (err) { console.error(err.message) };
  })



  bot.onText(/\/start/, async (msg) => {
    try {
      checkUser(msg,);

      const text = `*${msg.from.first_name}*, Добро пожаловать, в *Тренеровочный бот!*`;
      bot.sendMessage(getChatId(msg), text, {
        reply_markup: { remove_keyboard: true },
        parse_mode: 'Markdown'
      });
    }
    catch (err) { console.error(err.message) };
  });

  bot.onText(/\/profile/, async (msg) => {
    try {
      checkUser(msg,);
      console.log(msg);


      const text = `${msg.from.first_name}, Добро пожаловать, в *Личный кабинет!*\n\n` +
        'Здесь Вы можете:\n-ознакомиться с правилами;\n-выбрать режим обучения;\n' +
        '-подписаться на другие курсы;\n-внести пожертвование';
      bot.sendMessage(getChatId(msg), text, {
        reply_markup: { keyboard: keyboard.profile, resize_keyboard: true },
        parse_mode: 'Markdown'
      });
    }
    catch (err) { console.error(err.message) };
  });



}
