var mongoose = require('mongoose');
require('./locations');
require('./users')

var dbURI = 'mongodb://localhost/Loc8r';

if(process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGODB_URI;
};

mongoose.set('useCreateIndex', true)
mongoose.connect(dbURI, { useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error : ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGURS2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGURS2');
    });
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    })
})

process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});
