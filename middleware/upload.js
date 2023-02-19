const multer = require('multer')
const verify = require('../middleware/auth')

exports.handleFile = async (request, response, next) => {


    // console.log(request.headers['x-access-token'])
    let decoded = await verify(request, response, next);
    const upload = multer({
        storage: multer.diskStorage({
            destination: 'public/uploads/',
            filename: (req, file, cb) => {
              const name = file.originalname
              cb(null, `${new Date().getTime()}-${name}`)
            },
          }),
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload a valid image file'))
            }
            cb(undefined, true)
        }
    }).any();


    upload(request, response, (error) => {
        // let newResponse = { ...constant.defaultServerResponse };
        if (error instanceof multer.MulterError) {
            return response.status(400).json({
                message: 'Upload unsuccessful',
                errorMessage: error.message,
                errorCode: error.code
            })
        } if (error) {
            return response.status(500).json({
                message: 'Error occured',
                errorMessage: error.message
            })
        }
        next();

    })
};