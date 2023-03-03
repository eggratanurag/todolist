
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
   googleId: {type: String, required: true},
   name:  {type: String, required: true},
   lists: {
      type: Object
   }

},
{timestamps:true}
);



const User = mongoose.model('User', userSchema);
module.exports = User;