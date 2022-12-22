const express = require("express")
const router = express.Router();
const userController = require('../controller/userController')
const postController = require('../controller/postController')

const middleware = require('../middleware/auth')


//------------------------------------------------- User_Block -----------------------------------------------------\\

//____Creating_User____\\

router.post('/register', userController.CreateRegister)
//_____User_Login_______\\
router.post('/login', userController.userLogin)

//------------------------------------------------- Post_Block -------------------------------------------------------\\

//____Creating_Post____\\
router.post('/createPost', middleware.authenticate, postController.createPost)

//____Getting_Post____\\
router.get('/getPost', middleware.authenticate, postController.getPost)

//____Updating_Post____\\
router.put('/update/:postId',middleware.authenticate, postController.updatePost)

//____Delete_Post____\\
router.delete('/delete/:postId', middleware.authenticate, postController.deletePost);

router.get('/getIsActive',  postController.getIsActive)


router.get('/getLongitudeAndLatitude', postController.getLongitudeAndLatitude)



//API for wrong route-Of-API
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})

module.exports = router;


// faizan - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2EzMDcxNTk5MzJkOWI0ZDMyYzBiOTkiLCJjb21wYW55IjoiRmVibyIsIm9yZ2FuaXNhdGlvbiI6ImZlYm9PcmciLCJpYXQiOjE2NzE2ODM2ODUsImV4cCI6MTY3MTc3MDA4NX0.u8To6oAQ5EHNVGnnyf9bSFbjF1eimzmdvFcUayQHx1s

// krupa  - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2EzZGVjYjU1YzEyOTAxY2UzNTFkYmIiLCJjb21wYW55IjoiRmVibyIsIm9yZ2FuaXNhdGlvbiI6ImZlYm9PcmciLCJpYXQiOjE2NzE2ODM3OTksImV4cCI6MTY3MTc3MDE5OX0.yNhNqoWUna22_cyQ6XopK8oEdIjXuuxcIynJ5zEKilc