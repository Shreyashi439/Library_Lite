const express = require("express");
const router = express.Router();
const membersController = require("../controllers/members.controller");

// Add new member
router.post("/", membersController.createMember);

// Get all members + active loans
router.get("/", membersController.getMembers);

router.put("/:id", membersController.updateMember);

// Delete member
router.delete("/:id", membersController.deleteMember);

module.exports = router;
