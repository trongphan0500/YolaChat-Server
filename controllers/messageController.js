const Messages = require("../models/messageModel");
const formidable = require("formidable");
const fs = require("fs");
const messageModel = require("../models/messageModel");
const { log } = require("console");
const aws = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
    accessKeyId: "AKIARYU77JXTDSBHWEG5",
    secretAccessKey: "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",
    region: "us-west-1",
});

const loopArray = (images, fileArray) => {
    for (var i = 0; i < fileArray.length; i++) {
        let fileLocation = fileArray[i].location;
        images.push(fileLocation);
    }
};
const loopArrayName = (images, fileArray) => {
    for (var i = 0; i < fileArray.length; i++) {
        let fileNameOrigin = fileArray[i].originalname;
        images.push(fileNameOrigin);
    }
};

const checkFileTypesByName = (array) => {
    for (var i = 0; i < array.length; i++) {
        // console.log(array[i]);
        var endPoint = array[i].split(".");
        var ext = endPoint[endPoint.length - 1];
        // console.log(ext);
        switch (ext.toLowerCase()) {
            case "mp4":
            case "doc":
            case "video":
            case "document":
            case "pdf":
                //etc
                return true;
        }
    }
    return false;
};

const upload = (bucketName) =>
    multer({
        storage: multerS3({
            s3,
            bucket: bucketName,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            // if(checkFileTypesByName){

            // }
            key: function (req, file, cb) {
                cb(null, `image-${Date.now()}+${file.originalname}`);
            },
        }),
    });

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message, namesend, avatarImage } = req.body;
        const data = await Messages.create({
            message: { text: message, reaction: "" },
            users: [from, to],
            sender: from,
            namesend: namesend,
            avatarImage: avatarImage,
        });
        // console.log(data._id);

        if (data)
            return res.json({
                msg: "Message added successfully.",
                id: data._id,
            });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};

module.exports.addreaction = async (req, res, next) => {
    const { id, reaction } = req.body;
    // console.log(id);
    const filter = { _id: id.id };
    const update = { message: { text: id.message, reaction: reaction } };
    const data = await Messages.findOneAndUpdate(filter, update, { new: true });
    // console.log(data);
};

module.exports.imageMessageSend = (req, res, next) => {
    const form = formidable();
    console.log("Connected to imageMessageSend ");
    var senderNameOut, reseverIdOut, avatarImageOut;
    form.parse(req, (err, fields, files) => {
        console.log("Into dataForm");
        const { senderName, imageName, reseverId, images, file, avatarImage } =
            fields;
        senderNameOut = senderName;
        reseverIdOut = reseverId;
        avatarImageOut = avatarImage;
    });
    const uploadMultle = upload("appchat-picture-profile").array("images", 3);

    uploadMultle(req, res, async (error) => {
        console.log(req.files);
        if (error) {
            console.log("errors", error);
        } else {
            console.log("Into create Message");
            const fileNameArray = [];
            const imagesArray = [];
            loopArray(imagesArray, req.files);
            const insertMessage = await messageModel.create({
                sender: senderNameOut,
                users: [senderNameOut, reseverIdOut],
                message: {
                    text: "",
                    image: imagesArray,
                    files: null,
                    reaction: "",
                },
                avatarImage: avatarImageOut,
            });
            res.status(200).json({ data: insertMessage });
        }
    });
};

module.exports.fileMessageSend = (req, res, next) => {
    const form = formidable();
    console.log("Connected to FileSend ");
    var senderNameOut, reseverIdOut, avatarImageOut;
    form.parse(req, (err, fields, files) => {
        console.log("Into dataForm");
        const { senderName, imageName, reseverId, images, file, avatarImage } =
            fields;
        senderNameOut = senderName;
        reseverIdOut = reseverId;
        avatarImageOut = avatarImage;
    });
    const uploadMultle = upload("appchat-picture-profile").array("images", 3);

    uploadMultle(req, res, async (error) => {
        console.log(req.files);
        if (error) {
            console.log("errors", error);
        } else {
            console.log("Into create Message");
            const fileNameArray = [];
            const imagesArray = [];
            loopArray(imagesArray, req.files);
            const insertMessage = await messageModel.create({
                sender: senderNameOut,
                users: [senderNameOut, reseverIdOut],
                message: {
                    text: "",
                    image: null,
                    files: imagesArray,
                    reaction: "",
                },
                avatarImage: avatarImageOut,
            });
            res.status(200).json({ data: insertMessage });
        }
    });
};

// Handle Delete Message FromSelft
module.exports.deleteMessageFromSelf = async (req, res, next) => {
    console.log("Connect to Delete Message fromSelf");
    const { from, to, deletedToAll, deletedFromSelf } = req.body;

    const filter = { _id: from };
    const update = { deleted: { fromSelf: true, toAll: deletedToAll } };
    const data = await Messages.findOneAndUpdate(filter, update, { new: true });
    res.status(200).json({ data: data });
};

module.exports.deleteMessageToAll = async (req, res, next) => {
    console.log("Connect to Delete Message To All");
    const { from, to, deletedFromSelf, deletedToAll } = req.body;
    const filter = { _id: from };
    const update = {
        deleted: { fromSelf: deletedFromSelf, toAll: true },
    };
    const data = await Messages.findOneAndUpdate(filter, update, { new: true });

    res.status(200).json({ data: data });
};
module.exports.addreaction = async (req, res, next) => {
    console.log("updata reaction");
    const { id, reaction } = req.body;
    const filter = { _id: id.id };
    const update = { message: { text: id.message, reaction: reaction } };
    const data = await Messages.findOneAndUpdate(filter, update, { new: true });
    // console.log(data);
};

module.exports.setAvartar = async (req, res, next) => {
    console.log("Connected to SendAvatar ");
    const form = formidable();

    form.parse(req, (err, fields, files) => {
        console.log("Into dataForm");
        const { senderName, imageName, reseverId, images, file, avatarImage } =
            fields;
    });
    const uploadMultle = upload("appchat-picture-profile").array("images", 3);

    uploadMultle(req, res, async (error) => {
        console.log(req.files[0]);
        if (error) {
            console.log("errors", error);
        } else {
            console.log("Into create Message");

            res.status(200).json({ data: req.files[0].location });
        }
    });
};

module.exports.getMessages = async (req, res, next) => {
    // console.log("get MSG");
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ createdAt: 1 });
        // console.log(messages);
        const projectedMessages = messages.map((msg) => {
            return {
                id: msg._id,
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                createdAt: msg.createdAt.slice(16, 21),
                reaction: msg.message.reaction,
                avatarImage: msg.avatarImage,
                image: msg.message.image,
                files: msg.message.files,
                deletedFromSelf: msg.deleted.fromSelf,
                deletedToAll: msg.deleted.toAll,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};
module.exports.getnewMessages = async (req, res, next) => {
    // console.log("get MSG");
    const { from, to } = req.body;
    try {
        const messagess = await Messages.find({
            users: {
                $all: [from, to],
            },
        })
            .sort({ createdAt: -1 })
            .limit(1);
        const messages = messagess[0];
        var nowdate = Date();

        console.log(messages);
        if (messages) {
            console.log(messages);

            const date = messages.createdAt.slice(16, 21);
            const projectedMessages = {
                id: messages._id,
                fromSelf: messages.sender.toString() === from,
                message: messages.message.text,
                createdAt: date,
                reaction: messages.message.reaction,
                avatarImage: messages.avatarImage,
                image: messages.message.image,
                files: messages.message.files,
                deletedFromSelf: messages.deleted.fromSelf,
                deletedToAll: messages.deleted.toAll,
            };

            res.json(projectedMessages);
        } else {
            res.json(undefined);
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getnewMessagesRoom = async (req, res, next) => {
    try {
        const { id, from } = req.body;

        const messagess = await Messages.find({
            users: {
                $all: [id],
            },
        })
            .sort({ createdAt: -1 })
            .limit(1);
        const messages = messagess[0];
        if (messages) {
            var date;
            var nowdate = Date();

            date = messages.createdAt.slice(16, 21);
            const projectedMessages = {
                id: messages._id,
                fromSelf: messages.sender.toString() === from,
                message: messages.message.text,
                createdAt: date,
                reaction: messages.message.reaction,
                avatarImage: messages.avatarImage,
                image: messages.message.image,
                files: messages.message.files,
                deletedFromSelf: messages.deleted.fromSelf,
                deletedToAll: messages.deleted.toAll,
                namesend: messages.namesend,
            };

            res.json(projectedMessages);
        } else {
            res.json(undefined);
        }
    } catch (ex) {
        next(ex);
    }
};
module.exports.getMessagesRoom = async (req, res, next) => {
    // console.log("get MSG");
    try {
        const { id, from } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [id],
            },
        }).sort({ createdAt: 1 });

        const projectedMessages = messages.map((msg) => {
            // console.log(msg.deleted.toAll);
            return {
                id: msg._id,
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                createdAt: msg.createdAt.slice(16, 21),
                reaction: msg.message.reaction,
                namesend: msg.namesend,
                avatarImage: msg.avatarImage,
                image: msg.message.image,
                files: msg.message.files,
                deletedFromSelf: msg.deleted.fromSelf,
                deletedToAll: msg.deleted.toAll,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};
