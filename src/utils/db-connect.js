const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://admin:${process.env.ADMIN_PASSWORD}@cluster0-abume.mongodb.net/trening_bot?retryWrites=true&w=majority`, {
// mongoose.connect('mongodb://localhost:27017/trening_bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});


module.exports = mongoose.connection;
