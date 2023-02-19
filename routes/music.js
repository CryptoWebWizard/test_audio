const express = require('express');
const router = express.Router();
const userSchema = require('../schema/user')
const mController = require('../controller/musicController')
const verify = require('../middleware/auth')
// let upload = require('../middleware/upload')

// const multer = require('multer')
// const upload = multer({
    
//     storage: multer.diskStorage({
//         destination: 'public/uploads/',
//         filename: (req, file, cb) => {
//         //   const name = slugify(file.originalname, { lower: true })
//           const name = file.originalname
//           cb(null, `${new Date().getTime()}-${name}`)
//         },
//       }),
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload a valid image file'))
//         }
//         cb(undefined, true)
//     }
// })



// router.post('/add',verify,upload.single('file'), mController.uploadProfile);
router.post('/add',verify, mController.uploadSong);
router.get('/get',verify, mController.getSong);
router.delete('/delete/:id',verify, mController.deleteSong);
router.put('/update/:id',verify, mController.updateSong);

router.get('/play/:name', mController.playSong);

module.exports = router