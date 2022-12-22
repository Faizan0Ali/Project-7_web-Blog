const jwt = require("jsonwebtoken");
const postModel = require("../model/postModel");

const authenticate = async function (req, res, next) {
  try {
    // =======================authentication=====================

    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400) .send({status: false,  msg: " please provide the token" });
    }
    let decodedToken = jwt.verify(token, "demo");
    
    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "token is invalid" });
      
    }
    req.decodedToken=decodedToken

    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }};

  module.exports.authenticate = authenticate;


  const authorise = async function (req, res, next) {
    try {
      let token = req.headers["x-api-key"];
  if (!token) {
    return res.status(400) .send({status: false,  msg: " provide the token " });
  }
      let decodedToken = jwt.verify(token, "demo");
     
      if (!decodedToken) {
        return res.status(400).send({ status: false, msg: "token is invalid" });
        
      }
//   let postId = req.params;
//   console.log(postId)

//   let findPostId = await postModel.findById(postId)
//   console.log(findPostId)
//   let checkId = findPostId.createdBy.toString()

  
  let findid = await postModel.findById(userId);
  console.log(findid)
  let finduserId = decodedToken.userId;
  let checkuser = findid.userId.toString();
  console.log(finduserId)
  console.log(checkuser)

//   if (checkId !== finduserId)
//   return res.status(403).send({ status: false, msg: "User logged is not allowed to modifify" });  
  
  if (checkuser !== finduserId)
    return res.status(403).send({ status: false, msg: "User logged is not allowed to modifify" });  
  next();
} catch (err) {
  return res.status(500).send({ status: false, msg: err.message });
}
};


module.exports.authorise = authorise;