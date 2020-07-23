const { getChatId, checkUser, debug, debugMD } = require('./utils/helper');
const kbi = require('./utils/keyboard_inline-buttons');
const kb = require('./utils/keyboard-buttons');
const keyboard = require('./utils/keyboard');
const seedPosts = require("./seeder/seedPosts");
const seedUsers = require("./seeder/seedUsers");
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
        case kb.home.users:
          if (await checkNotAdmin(msg)) return;
          users = await User.getUsers();
          await bot.sendMessage(getChatId(msg), '*Список подписчиков:*\n', {
            reply_markup: { keyboard: keyboard.users, resize_keyboard: true },
            parse_mode: 'Markdown'
          });
          for (let i = 0; i < users.length; i++) {
            await bot.sendMessage(getChatId(msg), debugMD([users[i]]), {
              reply_markup: { inline_keyboard: kbi.user },
              parse_mode: 'Markdown'
            });
          }
          break;
        case kb.home.posts:
          if (await checkNotAdmin(msg)) return;
          bot.sendMessage(getChatId(msg), 'Настройка публикации:', {
            reply_markup: { keyboard: keyboard.posts, resize_keyboard: true }
          });
          break;
        case kb.home.settings:
          if (await checkNotAdmin(msg)) return;
          bot.sendMessage(getChatId(msg), 'Меню настроек:', {
            reply_markup: { keyboard: keyboard.settings, resize_keyboard: true }
          });
          break;
        case kb.users.clear:
          if (await checkNotAdmin(msg)) return;
          await User.deleteInactive();
          users = await User.find();
          text = `Неактивные подписчики удалены. Обновленный список:\n`;
          bot.sendMessage(getChatId(msg), text + debug(users), {
            reply_markup: { keyboard: keyboard.home, resize_keyboard: true }
          });
          break;
        case kb.posts.list:
          if (await checkNotAdmin(msg)) return;
          posts = await Post.getPosts();
          await bot.sendMessage(getChatId(msg), '*Список статей:\n*', {
            parse_mode: 'Markdown'
          });
          for (let i = 0; i < posts.length; i++) {
            await bot.sendMessage(getChatId(msg), debug([posts[i]]), {
              reply_markup: { inline_keyboard: kbi.post },
              parse_mode: 'Markdown'
            });
          }
          break;
        case kb.posts.period:
          if (await checkNotAdmin(msg)) return;
          bot.sendMessage(getChatId(msg), 'Периодичность рассылки статей:', {
            reply_markup: { keyboard: keyboard.period, resize_keyboard: true }
          });
          break;
        case kb.posts.add:
          if (await checkNotAdmin(msg)) return;
          text = '*/add* *title:*<порядковый номер> и ОДИН параметр.\n' +
            'Пример: */add* *title:*"1" *text:*"<текст статьи>" или другие.\n' +
            '/add title:"" text:""\n' +
            '/add title:"" img:""\n' +
            '/add title:"" video:""\n' +
            '/add title:"" audio1:""\n' +
            '/add title:"" audio2:""\n';
          bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
          break;
        case kb.posts.delete:
          if (await checkNotAdmin(msg)) return;
          await Post.collection.drop();
          text = 'Все *статьи* из базы успешно удалены';
          bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
          break;
        case kb.posts.seed:
          if (await checkNotAdmin(msg)) return;
          await Post.collection.drop();
          seedPosts();
          text = '*База* _статей_ была удалена и *восстановлена* из шаблона';
          bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
          break;
        case kb.period.min:
          if (await checkNotAdmin(msg)) return;
          config = await Config.findOne();
          config.publPeriod = 1;
          config.testMode = true;
          await config.save();
          tester = await User.findOne({tl_id: config.tester});
          tester.postsCounter = 0;
          tester.isActive = true;
          tester.hasMessage[0] = false;
          tester.hasMessage[1] = false;
          tester.hasMessage[2] = false;
          tester.save();
          text = 'Бот переведен в *тестовый режим*.\nПериодичность публикаций: 1 минута\n' +
          `сообщения будет получать: ${tester.first_name}`;
          bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
          break;
        case kb.period.max:
          if (await checkNotAdmin(msg)) return;
          config = await Config.findOne();
          config.publPeriod = 1440;
          config.testMode = false;
          await config.save();
          bot.sendMessage(getChatId(msg), 'Включен обычный режим. Периодичность публикаций 24 часа');
          break;
        case kb.period.start:
          if (await checkNotAdmin(msg)) return;
          config = await Config.findOne();
          config.postingIsActive = true;
          await config.save();
          bot.sendMessage(getChatId(msg), 'Публикация статей восстановлена ...');
          break;
        case kb.period.stop:
          if (await checkNotAdmin(msg)) return;
          config = await Config.findOne();
          config.postingIsActive = false;
          await config.save();
          bot.sendMessage(getChatId(msg), 'Публикация статей отменена ...');
          break;
        case kb.settings.admin:
          if (await checkNotAdmin(msg)) return;
          users = await User.getAdmins();
          text = '*Список администраторов бота:*\n' + debugMD(users);
          bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
          break;
        case kb.settings.seed:
          if (await checkNotAdmin(msg)) return;
          await User.collection.drop();
          seedUsers();
          text = '*База* _пользователей_ была удалена и *восстановлена* из шаблона';
          bot.sendMessage(getChatId(msg), text, { parse_mode: 'Markdown' });
          break;
        // case kb.settings.stop:
        //   await bot.sendMessage(getChatId(msg), 'Бот выключается ...:');
        //   require("child_process").execSync('killall node');
        //   break;
        case kb.back:
          if (await checkNotAdmin(msg)) return;
          bot.sendMessage(getChatId(msg), 'Главное меню Администратора:', {
            reply_markup: { keyboard: keyboard.home, resize_keyboard: true }
          });
          break;
      }
      if (msg.reply_to_message) {
        config = await Config.findOne();

        if (msg.reply_to_message.forward_from) {  
          bot.forwardMessage(msg.reply_to_message.forward_from.id, msg.chat.id, msg.message_id);
        } else bot.forwardMessage(config.mentor, msg.chat.id, msg.message_id);
      }
    }
    catch (err) { console.error(err.message) };
  })




  bot.onText(/\/admin/, async (msg) => {
    if (await checkNotAdmin(msg)) return;

    try {
      const text = `*${msg.from.first_name}*, Добро пожаловать. Вы *Администратор* бота!`;
      bot.sendMessage(getChatId(msg), text, {
        reply_markup: { keyboard: keyboard.home, resize_keyboard: true },
        parse_mode: 'Markdown'
      });
    }
    catch (err) { console.error(err.message) };
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

