const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const CreateRegister = async  (req, res) => {
    try {
        const data = req.body
        const { name, phone, email, password } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter valid Detail" })

        //____Mandatory_Fields____\\
        if (!name) return res.status(400).send({ status: false, message: "Name is mandatory" })
        if (!phone) return res.status(400).send({ status: false, message: "Phone is mandatory" })
        if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
        if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })

        //____Validation_Section____\\
        if (!/^[a-zA-Z ]{2,30}$/.test(name)) {
            return res.status(400).send({ status: false, message: "Name Should Be 2-30 Characters" })
        }
        if (!/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
            return res.status(400).send({ status: false, message: "Email Id Is Not Valid" })
        }
        if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Phone Number Is Not Valid it should be 10 Digit" })
        }
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "Password Should First Capital letter and 8-15 characters with one number" })
        }

        //____Duplicate_Validation____\\
        const duplicateEmail = await userModel.findOne({ email })
        if (duplicateEmail) return res.status(409).send({ status: false, message: `This Email Already Exist ::${email}` })

        const duplicatePhone = await userModel.findOne({ phone })
        if (duplicatePhone) return res.status(409).send({ status: false, message: `This Phone Number Already Exist ::${phone}` })

        //____Password_Hashing____\\
        const hash = bcrypt.hashSync(password, 12); // para1:password, para2:saltRound

        let userRegister = { name, email, phone, password: hash}
        const createData = await userModel.create(userRegister)

        res.status(201).send({ status: true, message: "Succesfully Created", data: createData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const userLogin = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter Details" })
        if (!email || !password) return res.status(400).send({ status: false, message: "Email Id And Password is mandatory" })

        const user = await userModel.findOne({ email:email})
        if (!user) return res.status(400).send({ status: false, message: "Email Or Password Is Incorrect" })

        const Passwordmatch = bcrypt.compareSync(password, user.password);
        if(Passwordmatch){
            //____Creating_JsonWebToken____\\
            let token = jwt.sign(
                {
                    userId: user._id.toString(),
                    company: "Febo",
                    organisation: "feboOrg"
                },
                "demo", { expiresIn: "24h" }
            );
            res.setHeader("x-api-key", token);
            res.status(200).send({ status: true, message: "Login successfully", token: token, issuedAt: new Date(), expiresIn: "24h" })
        }else {
            res.status(401).send({ status: false, message: "Password Is Inappropriate. ❗" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
 

module.exports = { CreateRegister, userLogin }