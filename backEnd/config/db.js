const mongoose = require( 'mongoose' );

const connectDb = async () => {
    const DB = process.env.DATABASE.replace( '<PASSWORD>', process.env.DATABASE_PASSWORD );
    try {
        await mongoose.connect( DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        } );
        console.log( 'DataBase Connected Successfully' );
            
    } catch ( error ) {
        
        console.warn( 'Error: ', error.message );
    }
};

module.exports = connectDb;