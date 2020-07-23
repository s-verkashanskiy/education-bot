const schedule = require('node-schedule');
const kbi = require('../utils/keyboard_inline-buttons');
const { User } = require('../models/user');
const { Post } = require('../models/post');
const { Config } = require('../models/config');


module.exports = {

  logStart() {
    console.log('>>>>>>>Bot has been started ...<<<<<<<<<');
  },
  postTo: async (user, posts, bot) => {
    try {
      await bot.sendMessage(user.tl_id, posts[user.postsCounter].text);
      // { reply_markup: { inline_keyboard: kbi.public }
      if (posts[user.postsCounter].img) await bot.sendPhoto(user.tl_id, posts[user.postsCounter].img);
      if (posts[user.postsCounter].url) await bot.sendPhoto(user.tl_id, posts[user.postsCounter].url);
      if (posts[user.postsCounter].video) await bot.sendVideo(user.tl_id, posts[user.postsCounter].video);
      if (posts[user.postsCounter].audio1) await bot.sendAudio(user.tl_id, posts[user.postsCounter].audio1);
      if (posts[user.postsCounter].audio2) await bot.sendAudio(user.tl_id, posts[user.postsCounter].audio2);
      user.postsLogs.push({
        message: 'post-' + user.postsCounter,
        date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
      });

      const text = 'Вы можете оставить комментарий по заданию ' +
      'в общем чате и обсудить его с другими участниками тренинга.';
      await bot.sendMessage(user.tl_id, text, {
        reply_markup: { inline_keyboard: kbi.public_comment }
      });
      console.log(`the "post-${posts[user.postsCounter].title}" has been sent to ${user.tl_id} (${user.first_name})`);
      user.postsLogs.push({
        message: `post-${user.postsCounter}" (comments request)`,
        date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
      });

      user.postsCounter++;
      user.hasMessage[0] = true;
      user.hasMessage[1] = false;
      await user.save();
    }
    catch (err) { console.error(err.message) };
  },
  msg19To: async (user, posts, bot) => {
    try {
      const text = 'Добрый вечер! Получилось ли выполнить задания дня? ' +
        'Для продолжения участия в тренинге - важно выполнять задания, ' +
        'после чего нажать кнопку (Задания дня выполнены)';
      await bot.sendMessage(user.tl_id, text, {
        reply_markup: { inline_keyboard: kbi.public_request }
      });
      user.postsLogs.push({
        message: '19-Message',
        date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
      });
      user.isActive = false;
      user.hasMessage[2] = true;
      await user.save();

      console.log(`the "19-Message" has been sent to ${user.tl_id} (${user.first_name})`);
    }
    catch (err) { console.error(err.message) };
  },
  testPost: async (chatId, post, bot) => {
    try {
      await bot.sendMessage(chatId, post.text);
      if (post.img) await bot.sendPhoto(chatId, post.img);
      if (post.url) await bot.sendPhoto(chatId, post.url);
      if (post.video) await bot.sendVideo(chatId, post.video);
      if (post.audio1) await bot.sendAudio(chatId, post.audio1);
      if (post.audio2) await bot.sendAudio(chatId, post.audio2);
      const user = await User.findOne({tl_id: chatId});
      user.postsLogs.push({
        message: 'post-' + user.postsCounter + ' (test message)',
        date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
      });
      user.save();
      console.log(`the "post-${title}" (test message) has been sent to ${chatId} (${user.first_name})`);
    }
    catch (err) { console.error(err.message) };
  },
  sendTime: (time, msg, text, bot) => {
    new schedule.scheduleJob({ start: new Date(Date.now() + Number(time) * 1000 * 60), end: new Date(new Date(Date.now() + Number(time) * 1000 * 60 + 1000)), rule: '*/1 * * * * *' }, function () {
      bot.sendMessage(msg.chat.id, text);
    });
    // sendTime(5,msg,'текст');
  },
  msgFirstTo: async (chatId, bot) => {
    try {
      const text = 'Для участников тренинга создана группа, в которой вы ' +
        'можете знакомиться и помогать друг другу, что очень рекомендую ' +
        'делать - так польза от тренинга будет в разы больше!';
      bot.sendMessage(chatId, text, {
        reply_markup: { inline_keyboard: kbi.introduce_to_group }
      });
      const user = await User.findOne({tl_id: chatId});
      user.postsLogs.push({
        message: '1-st Message',
        date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
      });
      await user.save();
      
      console.log(`the "first Message" has been sent to ${chatId} (${user.first_name})`);
    }
    catch (err) { console.error(err.message) };
  },
  msgSecondTo: async (chatId, bot) => {
    try {
      const text = 'Каждый день вечером вам будет высылаться напоминание о ' +
        'выполнении задания/написания отчета и будет предложено отметить ' +
        'выполнение нажатием на кнопку - это важно для продолжения участия ' +
        'и получения заданий на следующий день. Так и сегодня, если вы готовы ' +
        'с утра начать прохождение тренинга - после выполнения предварительных ' +
        'заданий - нажмите на кнопку ниже';
      bot.sendMessage(chatId, text, {
        reply_markup: { inline_keyboard: kbi.public_request }
      });
      const user = await User.findOne({tl_id: chatId});
      user.postsLogs.push({
        message: '2-nd Message',
        date: new Date(new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace(/ GMT$/, "")
      });
      user.save();
      console.log(`the "second Message" has been sent to ${chatId} (${user.first_name})`);
    }
    catch (err) { console.error(err.message) };
  },
}
