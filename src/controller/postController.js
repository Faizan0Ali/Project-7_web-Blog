const postModel = require('../model/postModel')
const mongoose = require('mongoose')

const createPost = async (req, res) => {
    try {
        const data = req.body
        const { title, body, createdBy, longitude, latitude } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter valid Detail" })

        //____Mandatory_Fields____\\
        if (!title) return res.status(400).send({ status: false, message: "title is mandatory" })
        if (!body) return res.status(400).send({ status: false, message: "body is mandatory" })
        if (!createdBy) return res.status(400).send({ status: false, message: "createdBy is mandatory" })
        // if (!geoLocation) return res.status(400).send({ status: false, message: "geoLocation is mandatory" })

        //____Validation_Section____\\
        if (!/^[a-zA-Z ]{2,30}$/.test(title)) {
            return res.status(400).send({ status: false, message: "title Should Be 2-30 Characters in String" })
        }
        if (!/^[a-zA-Z ]{2,10000}$/.test(body)) {
            return res.status(400).send({ status: false, message: "body Should Be In String" })
        }

        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).send({ status: false, message: 'Invalid createdBy Format' })
        }
        // if (!/^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?[0-8]\d((\.)|\.\d{1,6})?)|(0*?90((\.)|\.0{1,6})?))$/.test(geoLocation.coordinates[0])) {
        //     return res.status(400).send({ status: false, message: "Latitude must be in Number [-90, 90]" })
        // }
        // if (!/^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?\d\d((\.)|\.\d{1,6})?)|(0*?1[0-7]\d((\.)|\.\d{1,6})?)|(0*?180((\.)|\.0{1,6})?))$/.test(geoLocation.coordinates[1])) {
        //     return res.status(400).send({ status: false, message: "Longitude must be in Number [-180, +180]" })
        // }

        //____Duplicate_Validation____\\
        const duplicateTitle = await postModel.findOne({ title })
        if (duplicateTitle) return res.status(409).send({ status: false, message: `This Title Already Exist ::${title}` })

        const sendData = {
            title: title,
            body: body,
            createdBy: createdBy,
            geoLocation: {
                type: "Path",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
        }
        let userLoggedIn = req.decodedToken.userId
        if (createdBy !== userLoggedIn) {
            return res.status(403).send({ status: false, msg: "This user is not allowed to create post" })
        }

        const createdData = await postModel.create(sendData)

        res.status(201).send({ status: true, message: "Succesfully Created", data: createdData })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}

const getPost = async function (req, res) {
    try {

        let postDetails = await postModel.find({ isDeleted: false })
        if (postDetails.length === 0) return res.status(404).send({ status: false, msg: "post not found! " });

        res.status(200).send({ status: true, msg: "get post Sucessfully", data: postDetails });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.postId
        const data = req.body

        const { title, body, isActive, longitude, latitude } = data

        //____Validation_Section____\\
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter valid Detail" })

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({ status: false, message: 'Invalid postId Format' })
        }

        //____Duplicate_Validation____\\
        const duplicateTitle = await postModel.findOne({ title })
        if (duplicateTitle) return res.status(409).send({ status: false, message: `This Title Already Exist ::${title}` })

        const findPostId = await postModel.findById(postId)
        if (!findPostId) return res.status(404).send({ status: false, message: "postId doesn't exist" });

        let userLoggedIn = req.decodedToken.userId
        let createdBy = findPostId.createdBy.toString()
   
        if (createdBy !== userLoggedIn) {
            return res.status(403).send({ status: false, msg: "This user is not allowed to update post" })
        }

        const updatePost = await postModel.findByIdAndUpdate(postId,
            {
                $set: {
                    title: title,
                    body: body,
                    isActive: isActive,
                    longitude: longitude,
                    latitude: latitude
                }
            }, { new: true })

        return res.status(200).send({ status: true, data: updatePost, msg: "updated successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}
const deletePost = async function (req, res) {
    try {
        let postId = req.params.postId;

        let post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).send("No such post exists");
        }

        if (post.isDeleted == true) return res.status(400).send({ status: false, msg: "this post is already deleted" })

        let userLoggedIn = req.decodedToken.userId
        let createdBy = post.createdBy.toString()
   
        if (createdBy !== userLoggedIn) {
            return res.status(403).send({ status: false, msg: "This user is not allowed to delete this post" })
        }

        let deletePost = await postModel.findOneAndUpdate(
            { _id: postId },
            { $set: { isDeleted: true } },
            { new: true }
        );
        res.status(200).send({ status: true, data: deletePost, msg: "deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message });
    }
};


const getLongitudeAndLatitude = async (req, res) => {
    try {

        let { longitude, latitude } = req.query

        const filter = { isDeleted: false }


        const data1 = await postModel.findOne({ longitude, latitude })
        if (!data1) {
            return res.status(404).send({ status: false, msg: "No such post exists" });
        }

        // letz obj = {}

        //  obj.longitude = data1.geoLocation.coordinates[0]
        //  obj.latitude = data1.geoLocation.coordinates[1]


        // if(!obj.longitude == longitude){
        //    console.log("longitude not equal")
        // }
        // if(!obj.latitude == latitude){
        //     console.log("latitude not equal")
        // }else{
        //     console.log("both equal")
        // }
        // search1 = obj.longitude
        // search2 = obj.latitude
        // searchLongititude : ,
        // searchLatitude : 

        // const call = await postModel.findOne({ isDeleted: false, search1: longitude, search2 : latitude })
        // if (!call) {
        //     return res.status(404).send({status: false, msg: "No such post exists"});
        // }
        // console.log(call)
        // console.log(data1.geoLocation.coordinates[0])
        // console.log(data1.geoLocation.coordinates[1])
        // console.log(longitude)
        // console.log(latitude)


        // let d = data1.geoLocation
        // let b = data1.geoLocation

        // console.log(d.coordinates[0])
        // console.log(b.coordinates[1])

        // longitude = d.coordinates[0]
        // latitude = d.coordinates[1]
        // console.log(longitude)
        // console.log(latitude)


        res.status(200).send({ status: true, msg: "get post Sucessfully", data: data1 });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
//longitude : geoLocation.coordinates[0] , latitude : geoLocation.coordinates[1]

const getIsActive = async (req, res) => {
    try {

        let getIsActiveFalse = await postModel.find({ isDeleted: false, isActive: false }).count()
        let getIsActiveTrue = await postModel.find({ isDeleted: false, isActive: true }).count()

        if (!getIsActiveFalse) {
            return res.status(404).send({ status: false, message: "postId doesn't exist" })
        }
        if (!getIsActiveTrue) {
            return res.status(404).send({ status: false, message: "postId doesn't exist" })
        }

        res.status(200).send({ status: true, msg: "get post Sucessfully", getIsActiveFalse, getIsActiveTrue });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = { createPost, getPost, updatePost, deletePost, getLongitudeAndLatitude, getIsActive }