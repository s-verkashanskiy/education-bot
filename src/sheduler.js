const sendMethod = require('./posts/methods');
const { User } = require('./models/user');
const { Post } = require('./models/post');
const { Config } = require('./models/config');


module.exports = async (bot) => {

  const intervalId = setInterval(async () => {
    try {

      const config = await Config.findOne();
      if (!config) await new Config().save();

      const posts = await Post.find().populate('author').sort({ title: 1 });
      const users = await User.find({
        isActive: true,
        isInArchive: false,
        isAdmin: false
      });

      const currentDate = new Date().getHours() + ':' + new Date().getMinutes();
      console.log(currentDate);

      if (config.messageQueue.length) {
        for (let i = 0; i < config.messageQueue.length; i++) {
          if (config.messageQueue[i].delay === 0) {
            const messageName = config.messageQueue[i].function;
            const tl_id = config.messageQueue[i].tl_id;

            await sendMethod[messageName](tl_id, bot);
            config.messageQueue.splice(i, 1);
            await config.save();
            i--;
          }
        }
      }
      


      if (config.testMode && config.postingIsActive) {
        const user = await User.findOne({ tl_id: config.tester, isActive: true });
        if (user && user.postsCounter < posts.length) {
          console.log(user.postsCounter, posts.length - 1);

          if (!user.hasMessage[0]) await sendMethod['postTo'](user, posts, bot);
          if (!user.hasMessage[1]) await sendMethod['msg19To'](user, posts, bot);
        }
      }
      else if (config.postingIsActive) {
        for (let user of users) {
          // console.log(user);
          if (user.postsCounter > posts.length) continue;
          if (!user.hasMessage[0]) await sendMethod['postTo'](user, posts, bot);
          if (!user.hasMessage[1]) await sendMethod['msg19To'](user, posts, bot);
        }
      }
    }
    catch (err) { console.error(err.message) };
  }, 10000);

}
