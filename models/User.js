const mongoose = require('mongoose');
// pour éviter d'avoir des erreurs illisibles de mongodb, plugin de notre shcema
const uniqueValidator = require('mongoose-unique-validator');
// creation de notre schema avec la fonction Schema de mongoose
const userSchema = mongoose.Schema({
  // unique=true interdit d'avoir plusieurs même mails
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);