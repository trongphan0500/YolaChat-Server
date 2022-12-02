const Room = require("../models/roomModel");

module.exports.addRoom = async (req, res, next) => {
    try {
        const { members, roomName, manager } = req.body;
        const data = await Room.create({
            roomName: roomName,
            members: members,
            manager: manager,
        });
        if (data)
            return res.json({
                msg: "Room added successfully.",
                id: data._id,
                data: data,
            });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        next(error);
    }
};

module.exports.getRoom = async (req, res, next) => {
    // console.log("get MSG");
    try {
        const { id } = req.body;

        const rooms = await Room.find({
            members: {
                $all: [id],
            },
        }).sort({ createdAt: 1 });

        const projectedMessages = rooms.map((room) => {
            return {
                id: room._id,
                manager: room.manager,
                roomName: room.roomName,
                members: room.members,
                createdAt: room.createdAt,
                blockChat: room.blockChat,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};
module.exports.addThanhVien = async (req, res, next) => {
    try {
        const id = req.body.id;
        const mems = req.body.mems;
        const member = await Room.findByIdAndUpdate(
            id,
            {
                members: mems,
            },
            { new: true }
        );
        console.log(id);
        return res.json({
            mess: "Them Thanh Cong",
        });
    } catch (ex) {
        next(ex);
    }
};
module.exports.updateManager = async (req, res, next) => {
    try {
        const { id, idManager } = req.body;
        const respon = await Room.findByIdAndUpdate(
            id,
            {
                manager: idManager,
            },
            { new: true }
        );
        // console.log(id);
        return res.json({
            mess: "update thanh cong",
        });
    } catch (ex) {
        next(ex);
    }
};
module.exports.renameRoom = async (req, res, next) => {
    try {
        const { id, roomName } = req.body;
        const respon = await Room.findByIdAndUpdate(
            id,
            {
                roomName: roomName,
            },
            { new: true }
        );
        // console.log(id);
        return res.json({
            mess: "update thanh cong",
        });
    } catch (ex) {
        next(ex);
    }
};
module.exports.blockChat = async (req, res, next) => {
    try {
        const { id, blocks } = req.body;

        const respon = await Room.findByIdAndUpdate(
            id,
            {
                blockChat: blocks,
            },
            { new: true }
        );
        // console.log(id);
        return res.json({
            mess: "update thanh cong",
        });
    } catch (ex) {
        next(ex);
    }
};
module.exports.deleteRoom = async (req, res, next) => {
    // console.log("get MSG");
    try {
        const { id } = req.body;

        const rooms = await Room.deleteOne({
            _id: id,
        });

        res.json(rooms);
    } catch (ex) {
        next(ex);
    }
};
