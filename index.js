// process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
require("./src/utils/db-connect");
const { logStart } = require('./src/utils/helper');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./src/utils/config');
const bot = new TelegramBot(config.token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: { timeout: 10 }
  }
});


const admin = require("./src/admin");
const post = require("./src/posts/post");
const sheduler = require("./src/sheduler");
const user = require("./src/user");
user(bot);
sheduler(bot);
post(bot);
admin(bot);


logStart();


module.exports = bot;
