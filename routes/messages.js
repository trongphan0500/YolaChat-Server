const {
    addMessage,
    getMessages,
    addreaction,
    getMessagesRoom,
    imageMessageSend,
    fileMessageSend,
    deleteMessageFromSelf,
    deleteMessageToAll,
    setAvartar,
    getnewMessages,
    getnewMessagesRoom,
} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/addreaction/", addreaction);
router.post("/getMessagesRoom/", getMessagesRoom);

router.post("/image-message-send/", imageMessageSend);
router.post("/file-message-send/", fileMessageSend);

router.post("/delete-message-fromSelf/", deleteMessageFromSelf);
router.post("/delete-message-toAll/", deleteMessageToAll);
router.post("/setAvartar/", setAvartar);
router.post("/getnewMessages/", getnewMessages);
router.post("/getnewMessagesRoom/", getnewMessagesRoom);

module.exports = router;
