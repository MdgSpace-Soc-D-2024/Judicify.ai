const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require("../Models/User.js")

const signup =async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const user = await UserModel.findOne({ email });
        if(user){
            return res.status(409)
            .json({message: "User already exists", success: false})
        }
        const userModel = new UserModel({ name, email, password})
        userModel.password = await bcrypt.hash(password, 10)
        await userModel.save()
        const jwtToken = jwt.sign(
            {email: userModel.email, _id:userModel._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )
        res.status(200)
        .json({
            message: "Signup Successfully and Logged in",
            success: true,
            jwtToken,
            email,
            name: userModel.name
        })
    }catch (err){
        res.status(500)
            .json({
                message: "Internal server error", success: false
            })
    }
}

const login =async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await UserModel.findOne({ email });
        if(!user){
            return res.status(403)
            .json({message: "User not exists, Check email and password OR signup first", success: false})
        }
        const isPassEqual = await bcrypt.compare(password, user.password)
        if(!isPassEqual){
            return res.status(403)
            .json({message: "User not exists, Check email and password OR signup first", success: false})
        }
        const jwtToken = jwt.sign(
            {email: user.email, _id:user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )
        res.status(200)
            .json({
                message: "Login successfully",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    }catch (err){
        res.status(500)
            .json({
                message: "Internal server error", success: false
            })
    }
}


module.exports = {
    signup, login
}