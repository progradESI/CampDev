const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/pictures')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const filter = (req, file, cb) => {
    console.log(file.mimetype);
    if(file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg') 
    {
        cb(null, true);
    } else {
        const error = new Error('only files with extentions png,jpg & jpeg are allowed');
        error.status = httpStatus.UNSUPPORTED_MEDIA_TYPE
        cb(error, false);
    }
};

const uploadPicture = multer({
    storage: storage,
    fileFilter: filter
});

module.exports = uploadPicture;