const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  tl_id: {
    type: Number,
    unique: [true, "Указанный Id телеграмм не уникальный"],
    required: [true, "Не указан Id пользователя телеграм"],
  },

  is_bot: {
    type: Boolean,
    default: false
  },
  first_name: {
    type: String,
    required: [true, "Не указано имя пользователя"],
  },
  last_name: {
    type: String
  },
  username: {
    type: String,
    trim: true
  },
  registrationDate: {
    type: String,
    default: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
  },
  hasMessage: [
    {
      type: Boolean,
      default: false
    }
  ],
  postsCounter: {
    type: Number,
    default: 0
  },
  postsLogs: [
    {
      message: String,
      date: String
    }
  ],
  isActive: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isInArchive: {
    type: Boolean,
    default: false
  },
});

userSchema.static("getUsers", async function () {
  try {
    let users = await this.find({isAdmin: false});
    users = users.map(user => { return {
      "ник в телеграм": user.username,
      "Имя": user.first_name,
      "Фамилия": user.last_name,
      "id в телеграм": user.tl_id,
      "это бот?": user.is_bot,
      "первое подключение": user.registrationDate,
      "активен?": user.isActive,
      "число высланных постов": user.postsCounter
    }});
    return users;    
  }
  catch (err) { console.error(err.message) };
});
userSchema.static("getLogs", async function (tl_id) {
  try {
    const user = await this.findOne({ tl_id });
    let statistics = '--------------\n';

    for (let i = 0; i < user.postsLogs.length; i++) {
      statistics += `*message:* ${user.postsLogs[i].message};\n`;
      statistics += `*date:* ${user.postsLogs[i].date};\n\n`;
    }
    console.log(tl_id, 'statistics:', statistics);
    return statistics;    
  }
  catch (err) { console.error(err.message) };
});

userSchema.static("deleteInactive", async function () {
  try {
    const users = await this.find({isActive: false});
    users.forEach(user => user.remove());
  }
  catch (err) { console.error(err.message) };
});

userSchema.static("getAdmins", async function () {
  try {
    let users = await this.find({isAdmin: true});
    users = users.map(user => { return {
      "ник в телеграм": user.username,
      "Имя": user.first_name,
      "Фамилия": user.last_name,
      "id в телеграм": user.tl_id,
      "это бот?": user.is_bot,
      "первое подключение": user.registrationDate,
      "активен?": user.isActive,
      "число отосланных постов": user.postsCounter
    }});
    return users;    
  }
  catch (err) { console.error(err.message) };
});

const User = model("User", userSchema);

module.exports = { User };
