const multer=require('multer')
/**1)Upload single file to memory */
const storage = multer.memoryStorage();
const fileFilter = ( req, file, cb ) => {
    if ( file.mimetype.startsWith( 'image' ) ) {
        cb( null, true );
    } else {
        cb('Not an Image Please upload only images',false)
    }
}

const upload = multer( {
    storage,
    fileFilter
} );
exports.uploadImageToMemory = ( fieldname ) => upload.single( `${ fieldname }` );
