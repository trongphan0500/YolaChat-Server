const User = require("../models/userModel");
const Friend = require("../models/friendModal");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
    try {
        const { phonenumber, password } = req.body;
        // console.log(req.body);
        const user = await User.findOne({ phonenumber });
        if (!user)
            return res.json({
                msg: "Incorrect SDT or Password",
                status: false,
            });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({
                msg: "Incorrect SDT or Password",
                status: false,
            });
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};
module.exports.ktraSDT = async (req, res, next) => {
    try {
        const { phonenumber } = req.body;
        // console.log(phonenumber);
        const user = await User.findOne({ phonenumber });
        if (user)
            return res.json({ msg: "SDT đã được sử dụng", status: false });
        return res.json({ msg: "SDT ok", status: true });
    } catch (ex) {
        next(ex);
    }
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, phonenumber, password } = req.body;
        // const usernameCheck = await User.findOne({ username });
        // if (usernameCheck)
        //   return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ phonenumber });
        if (emailCheck)
            return res.json({ msg: "SDT already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            phonenumber,
            password: hashedPassword,
        });

        const friend = await Friend.create({
            userId: user._id,
            friendId: [],
        });

        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    // console.log(req.body);
    try {
        const users = await User.find({ _id: { $ne: req.body.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true }
        );
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
};

module.exports.logOut = (req, res, next) => {
    try {
        if (!req.params.id) return res.json({ msg: "User id is required " });
        onlineUsers.delete(req.params.id);
        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
};
module.exports.updateUser = async (req, res, next) => {
    console.log("Update User");
    try {
        const { avatarImage, userName, gender, date, phonenumber } = req.body;
        // console.log(date);
        // console.log(date.slice(0, 10));
        const filter = { phonenumber: phonenumber };
        const update = {
            avatarImage: avatarImage,
            username: userName,
            gender: gender,
            DateOfBirth: date,
        };
        const request = await User.findOneAndUpdate(filter, update);
        const request2 = await User.find({
            phonenumber: phonenumber,
        });

        res.status(200).json({
            data: request2,
        });
    } catch (error) {}
};
