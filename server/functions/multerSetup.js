const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, './uploads/pdfs');
        } else if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            cb(null, './uploads/images');
        } else if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
            cb(null, './uploads/documents'); 
        } else if (file.mimetype === 'text/html') {
            cb(null, './uploads/html'); 
        } else if (file.mimetype === 'text/css') {
            cb(null, './uploads/css');
        } else if (file.mimetype === 'application/javascript' || file.mimetype === 'text/javascript') {
            cb(null, './uploads/js'); 
        } else {
            cb(null, './uploads/others'); 
        }
    },
    filename: function (req, file, cb) {
        const filename='', fileExtension='';
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            filename = req.body.username;
            fileExtension = path.extname(file.originalname);
            cb(null, `${filename}${fileExtension}`);
        } 
        
    },
});

const upload = multer({ storage });

module.exports = upload;