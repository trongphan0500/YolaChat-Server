const {
    addFriend,
    getUserByPhoneNumber,
    getCurrentFriend,
    getIdOfListFriendByPhoneNumber,
    getAllCurrentFriend,
    getUserByPhoneNumberOrUserName,
} = require("../controllers/friendController");

const router = require("express").Router();

router.post("/addFriend", addFriend);
router.post("/getUserByPhoneNumber", getUserByPhoneNumber);
router.post("/getCurrentFriend", getCurrentFriend);
router.post("/getIdOfListFriendByPhoneNumber", getIdOfListFriendByPhoneNumber);
router.post("/getAllCurrentFriend", getAllCurrentFriend);
router.post("/getUserByPhoneNumberOrUserName", getUserByPhoneNumberOrUserName);

module.exports = router;
