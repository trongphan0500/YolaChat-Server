const Friend = require("../models/friendModal");
const User = require("../models/userModel");
var mongoose = require("mongoose");
module.exports.getUserByPhoneNumber = async (req, res, next) => {
    try {
        const { phoneNumber, currentUserId } = req.body;

        const user = await User.find({
            phonenumber: [phoneNumber],
        }).sort({ createdAt: 1 });

        res.status(200).json({ data: user });
    } catch (error) {
        next(error);
    }
};

module.exports.getUserByPhoneNumberOrUserName = async (req, res, next) => {
    try {
        const { search, currentUserId, username } = req.body;

        const user = await User.find({
            $or: [{ phonenumber: search }, { username: search }],
        }).sort({ createdAt: 1 });

        res.status(200).json({ data: user });
    } catch (error) {
        next(error);
    }
};

module.exports.getIdOfListFriendByPhoneNumber = async (req, res, next) => {
    try {
        const { phoneNumber, currentUserId } = req.body;
        const user = await User.find({
            phonenumber: [phoneNumber],
        }).sort({ createdAt: 1 });

        const AllFriendId = await Friend.find({}).sort({ createdAt: 1 });
        const currentId = await Friend.find({ userId: currentUserId }).sort({
            createdAt: 1,
        });

        const handleAdd = async () => {
            const friend = await Friend.create({
                userId: currentUserId,
                friendId: user[0]._id,
            });
        };

        if (AllFriendId.indexOf(currentId) === -1) {
        } else {
            handleAdd();
        }
        res.status(200).json({ data: user, data2: currentId[0]._id });
    } catch (error) {
        next(error);
    }
};

module.exports.getCurrentFriend = async (req, res, next) => {
    try {
        const { phoneNumber, currentUserId } = req.body;

        const currentFriendListOf = await Friend.find({
            userId: currentUserId,
        }).sort({
            createdAt: 1,
        });

        const id = currentFriendListOf[0].friendId;

        const lisyId = [];
        const listCurruentFriend1 = await User.find();
        listCurruentFriend1.forEach((element) => {
            lisyId.push(element._id.toString());
        });

        const listCurruentFriend = [];
        lisyId.forEach(async (m, i) => {
            id.forEach((e, index) => {
                if (lisyId.indexOf(e) === -1) {
                } else {
                    listCurruentFriend.push(
                        listCurruentFriend1[lisyId.indexOf(e)]
                    );
                }
            });
        });

        let uniqueChars = [...new Set(listCurruentFriend)];

        res.status(200).json({
            //danh sách id trong list FriendId
            data: currentFriendListOf[0].friendId,
            // Mảng các user trong list Friend
            data2: uniqueChars,
        });
    } catch (error) {
        console.log(err);
        next(error);
    }
};

module.exports.getAllCurrentFriend = async (req, res, next) => {
    console.log("getAllCurrentFriend");
    try {
        const { phoneNumber, currentUserId } = req.body;

        const currentFriendListOf = await Friend.find({
            userId: currentUserId,
        }).sort({
            createdAt: 1,
        });

        res.status(200).json({
            //danh sách id trong list FriendId
            data: currentFriendListOf[0].friendId,
            // Mảng các user trong list Friend
        });
    } catch (error) {
        next(error);
    }
};

module.exports.addFriend = async (req, res, next) => {
    console.log("Add Friend");
    try {
        const { listFriendOfId, friendId } = req.body;

        const member = await Friend.findByIdAndUpdate(
            listFriendOfId,
            {
                friendId: friendId,
            },
            { new: true }
        );

        return res.json({
            mess: "Them Thanh Cong",
        });
    } catch (error) {
        next(error);
    }
};
