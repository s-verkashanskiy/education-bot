const { getChatId, checkUser, debug } = require('../utils/helper');
const { testPost } = require('./methods');
const kb = require('../utils/keyboard-buttons');
const kbi = require('../utils/keyboard_inline-buttons');
const { User } = require('../models/user');
const { Post } = require('../models/post');
const { Config } = require('../models/config');


module.exports = (bot) => {

  bot.onText(/\/add title:"(\d+)" (.+):"(.+)"/, async (msg, [source, title, key, value]) => {
    if (await checkNotAdmin(msg)) return;
    // console.log('title', title, 'key', key, 'value', value);

    try {
      let text = '';
      const post = await Post.findOne({ title });

      if (!post) {
        user = await User.findOne({ tl_id: msg.from.id });

        const newPost = new Post({
          title,
          [key]: value,
          author: user._id
        });
        console.log(newPost);
        text = 'Cтатья внесена в БД успешно:\n' +
          `статус: *новая*\nСодержание: *title:* ${title},  *${key}*: ${value}`
        await newPost.save();
      } else {
        text = 'В статью были внесены изменения:\n' +
          `статус: *успешно*\nСодержание: *title:* ${title},  *${key}*: ${value}`
        post[key] = value;
        await post.save();
      }
      bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
    }
    catch (err) {
      console.error(err);
      bot.sendMessage(getChatId(msg), err.message);
    };
  });

  bot.on('callback_query', async (query) => {
    bot.answerCallbackQuery(query.id, query.data);
    const { chat, message_id, text } = query.message;
    try {
      let user;

      switch (query.data) {

        case 'user_statistic':
          const statistics = await User.getLogs(+text.match(/(\d\d{5,11})/g));
          bot.editMessageText(`${text}\n${statistics}`, {
            chat_id: chat.id,
            message_id,
            reply_markup: { inline_keyboard: kbi.user  },
            parse_mode: 'Markdown'
          });
          break;
        case 'user_delete':
          bot.deleteMessage(chat.id, message_id);
          await User.findOne({ tl_id: +text.match(/(\d\d{5,11})/g) }).remove();
          break;
        case 'delete_post':
          bot.deleteMessage(chat.id, message_id);
          const us = await Post.findOne({ title: +text.match(/(\d{1,2})/)[0] }).remove();
          break;
        case 'test_post':
          const post = await Post.findOne({ title: +text.match(/(\d{1,2})/)[0] });
          testPost(chat.id, post, bot);
          break;
        case 'request_post':
          user = await User.findOne({ tl_id: chat.id });
          const postsNumber = await (await Post.find()).length;
          user.isActive = true;
          user.hasMessage[0] = false;
          user.hasMessage[1] = false;
          user.save();
          let message;
          if (user.postsCounter < postsNumber) {
            message = 'Подписка подтверждена. Ожидайте новых публикаций';
          } else message = 'Курс подошел к концу. Спасибо Вам за участие!';
          bot.sendMessage(chat.id, message, { reply_to_message_id: message_id });

          break;
      }
    } catch (err) {
      console.error(err);
      bot.sendMessage(chat.id, err.message);
    };

    bot.answerCallbackQuery({
      callback_query_id: query.id
    });
  });


  const checkNotAdmin = async (msg) => {
    const isAdmin = await checkUser(msg,);
    if (!isAdmin) {
      text = msg.from.first_name + ', у Вас не достаточно прав для выполнения операции';
      bot.sendMessage(getChatId(msg), text, {
        reply_markup: { remove_keyboard: true }
      });
      return true;
    }
  }
}
