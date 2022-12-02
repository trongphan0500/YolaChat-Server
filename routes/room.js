const {
    addRoom,
    getRoom,
    addThanhVien,
    updateManager,
    renameRoom,
    blockChat,
    deleteRoom,
} = require("../controllers/roomController");

const router = require("express").Router();
router.post("/addRoom/", addRoom);
router.post("/getRoom/", getRoom);
router.post("/addTT/", addThanhVien);
router.post("/updateManager/", updateManager);
router.post("/renameRoom/", renameRoom);
router.post("/blockChat/", blockChat);
router.post("/deleteRoom/", deleteRoom);
module.exports = router;
