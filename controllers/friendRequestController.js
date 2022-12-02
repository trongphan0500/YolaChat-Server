const RequestFriend = require("../models/friendRequestModal");
const User = require("../models/userModel");
const Friend = require("../models/friendModal");
const FriendRequest = require("../models/friendRequestModal");
var mongoose = require("mongoose");
module.exports.requestFriend = async (req, res, next) => {
    console.log("Request Friend");
    try {
        const { received, senderId } = req.body;
        const currentRequest = await RequestFriend.find({
            senderId: {
                $all: [senderId],
            },
            received: {
                $all: [received],
            },
        });
        const allRequest = await RequestFriend.find({});
        const user = await User.find({
            phonenumber: senderId,
        });

        //   if(allRequest.indexOf())
        const data = await RequestFriend.create({
            received: received,
            senderId: senderId,
            agreed: false,
        });
        res.status(200).json({
            data: data,
            data2: user,
        });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllFriendRequstById = async (req, res, next) => {
    try {
        const { received, currentPhoneNumber, phoneNumber } = req.body;

        const allRequest = await RequestFriend.find({
            agreed: false,
        });
        const listRequest = await RequestFriend.find({
            received: {
                $all: [currentPhoneNumber],
            },
            agreed: false,
        });

        const listSendedRequest = await RequestFriend.find({
            senderId: {
                $all: [currentPhoneNumber],
            },
            received: {
                $all: [phoneNumber],
            },
            agreed: false,
        });

        const listPhoneRequest = [];
        listRequest.map((m, i) => {
            listPhoneRequest.push(m.senderId);
        });

        const listPhoneAllUser = [];

        const allUser = await User.find();
        allUser.forEach((element) => {
            listPhoneAllUser.push(element.phonenumber);
        });

        const listUserRequest = [];
        listPhoneAllUser.forEach(async (m, i) => {
            listPhoneRequest.forEach((e, index) => {
                if (listPhoneAllUser.indexOf(e) === -1) {
                } else {
                    listUserRequest.push(allUser[listPhoneAllUser.indexOf(e)]);
                }
            });
        });
        let uniqueChars = [...new Set(listUserRequest)];

        res.status(200).json({
            data: uniqueChars,
            //Các yêu cầu kết bạn chưa đồng ý
            data2: listRequest,
            //Các yêu cầu kết bạn đã gửi
            data3: listSendedRequest,
            //Tất cả các lời mời chưa được đồng ý
            data4: allRequest,
        });
    } catch (ex) {
        next(ex);
    }
};

module.exports.agreeRequestFriend = async (req, res, next) => {
    console.log("Agree Request Friend");
    try {
        const { received, senderId } = req.body;

        const filter = { received: received, senderId: senderId };
        const update = { agreed: true };
        const request = await RequestFriend.findOneAndUpdate(filter, update);

        res.status(200).json({
            data: "Them ban thanh cong",
        });
    } catch (error) {}
};
module.exports.rejectRequestFriend = async (req, res, next) => {
    console.log("reject Request Friend");
    try {
        const { received, senderId } = req.body;

        const filter = { received: received, senderId: senderId };

        const request = await RequestFriend.deleteOne(filter);

        const user = await User.findOne({
            phoneNumber: senderId,
        });

        res.status(200).json({
            data: user,
        });
    } catch (error) {}
};

module.exports.unFriend = async (req, res, next) => {
    console.log("Un Friend");
    try {
        const { received, senderId, receivedPhoneNumber, senderPhoneNumber } =
            req.body;
        //Xóa trong dánh sách người bị hủy
        const request1 = await Friend.findOne({
            userId: received,
        });
        const index1 = request1.friendId.indexOf(senderId);
        request1.friendId.splice(index1, 1);
        const filter1 = { userId: received };
        const update1 = { friendId: request1.friendId };
        const friend1 = await Friend.findOneAndUpdate(filter1, update1);

        // Xóa trong danh sách bạn người hủy
        const request2 = await Friend.findOne({
            userId: senderId,
        });
        const index2 = request2.friendId.indexOf(received);
        request2.friendId.splice(index2, 1);
        const filter2 = { userId: senderId };
        const update2 = { friendId: request2.friendId };
        const friend2 = await Friend.findOneAndUpdate(filter2, update2);

        // Lấy ra trạng thái đã gửi lời mời kết bạn hay chưa
        console.log(senderPhoneNumber);
        console.log(receivedPhoneNumber);
        const status = await FriendRequest.findOne({
            senderId: senderPhoneNumber,
            received: receivedPhoneNumber,
        });
        console.log(status.agreed);

        // Lấy ra mảng các user trong list friend
        const lisyId = [];
        const listCurruentFriend = [];
        const id = request2.friendId;
        const listCurruentFriend1 = await User.find();
        listCurruentFriend1.forEach((element) => {
            lisyId.push(element._id.toString());
        });
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

        //Xóa lời mời kết bạn

        const filterRemove1 = {
            received: receivedPhoneNumber,
            senderId: senderPhoneNumber,
        };
        const filterRemove2 = {
            received: senderPhoneNumber,
            senderId: receivedPhoneNumber,
        };

        const remove1 = await RequestFriend.deleteOne(filterRemove1);
        const remove2 = await RequestFriend.deleteOne(filterRemove2);

        res.status(200).json({
            // Danh sách các user trong list friend
            data: uniqueChars,
            //Trạng thái đã gửi lời mời hay chưa
            data2: status.agreed,
        });
    } catch (error) {}
};

module.exports.checkSendedRequestAddFriend = async (req, res, next) => {
    try {
        const { received, senderId } = req.body;

        const filter = { senderId: senderId, received: received };
        // const request = await RequestFriend.deleteOne(filter);
        const user = await RequestFriend.find({
            senderId: {
                $all: [senderId],
            },
            received: {
                $all: [received],
            },
        });

        res.status(200).json({
            data: user[0].agreed,
        });
    } catch (error) {}
};
