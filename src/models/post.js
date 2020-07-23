const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;


const postSchema = new Schema({
  title: {
    type: Number,
    unique: [true, "Заголовок статьи не уникальный"],
    trim: true,
    required: [true, "Не указан заголовок статьи"]
  },
  text: {
    type: String
  },
  img: {
    type: String
  },
  video: {
    type: String
  },
  audio1: {
    type: String
  },
  audio2: {
    type: String
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: [true, "Не указан автор статьи"]
  },
  registrationDate: {
    type: String,
    default: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
  },
  modifyDate: {
    type: String,
    default: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

postSchema.static("getPosts", async function () {
  try {
    let posts = await this.find().populate('author').sort({title: 1});
    posts = posts.map(post => { return {
      "порядковый номер": post.title,
      "текст": post.text,
      "картинка": post.img,
      "видео": post.video,
      "звук1": post.audio1,
      "звук2": post.audio2,
      "автор статьи": `${post.author.first_name} ${post.author.last_name} (id:${post.author.tl_id})`,
      "дата регистрации": post.registrationDate,
      "последняя правка": post.modifyDate,
      "активна?": post.isActive
    }});
    // console.log(posts);
    
    return posts;    
  }
  catch (err) { console.error(err.message) };
});


const Post = model("Post", postSchema);

module.exports = { Post };
