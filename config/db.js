const mongoose = require('mongoose');

//Map global promise
mongoose.Promise = global.Promise;

mongoose.connect('add data base connection url here',
                 { useNewUrlParser: true ,useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'));