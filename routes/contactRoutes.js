const express = require("express");
const router = express.Router();
const {
  getContacts,
  getIndividualContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContacts);
router.route("/:id").get(getIndividualContacts);

router.route("/").post(createContact);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

module.exports = router;
