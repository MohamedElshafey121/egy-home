const express = require( 'express' );
const mongoose = require( 'mongoose' );
const dotenv = require( 'dotenv' );
const faker = require( 'faker' );
const Category = require( '../models/categoryModel' );
const SubCategory = require( '../models/subCategoryModel' );
const Product = require( '../models/productModel' );

dotenv.config( { path: '../config.env' } );
const DB = process.env.DATABASE.replace( '<PASSWORD>', process.env.DATABASE_PASSWORD );

mongoose.connect( process.env.LOCAL_DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology:true
} ).then( () => console.log( 'DB connected successfully' ) )
    .catch( ( error ) => console.log( error.message ) );

const productName = faker.commerce.productName();

//Document count
const getLength = async (Model) => {
    const num =await Model.find().countDocuments();
    console.log( `Number = ${num}` );
}

//Category seeder
const importCategories = async () => {
    try {
        for ( let x = 0; x < 50; x++ ){
            const name = await faker.commerce.department();
            const photo = await faker.image.image();
            await Category.create( { name, photo } );
        };
    } catch ( err ) {
        console.log( err );
    };
};

//Sub Categories seeder
const importSubCategories = async () => {
    const categories = await Category.find();
    categories.forEach(async (cat) => {
        console.log( cat.name, cat._id );
        for ( let x = 0; x < 50; x++ ){
            const name = faker.company.companyName();
            const photo =  faker.image.image();
            const category = cat._id;

            await SubCategory.create( {
                name,
                photo,
                category
            })
        }
    })
}


/** Products Seeder */
const importProducts = async () => {
    const subCategories = await SubCategory.find()
    subCategories.forEach( async ( cat ) => {
        
        for ( let x = 0; x < 50; x++ ) {
            const name = faker.commerce.productName();
            const description = faker.commerce.productDescription();
            const photo = faker.image.business();
            const price = faker.commerce.price();
            const size = 'XL';
            const color = faker.commerce.color();
            const category = cat._id;
            const reviewed = true;
            const available = true;

            await Product.create( {
                name,
                description,
                photo,
                price,
                size,
                color,
                category,
                reviewed,
                available
            } );
        }

    } )
}

    function generateRating () {
        const rating = ( Math.random() * 2 ) + 3;
        // console.log( rating );
        return rating;
}

async function addRatingToProducts () {
    const products = await Product.find();
    await Promise.all( products.map( async ( product ) => {
        product.rating = generateRating();
        await product.save();
    } ) );
    process.exit();
}
addRatingToProducts()
    // for ( let x = 0; x < 30; x++ ){
    //     generateRating();
    // };
// importCategories();
// importSubCategories();
importProducts();
// getLength( SubCategory );