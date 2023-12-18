const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// @desc GET all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc GET all contacts
// @route GET /api/contacts/test
// @access private
const test = asyncHandler(async (req, res) => {
  console.log("insude test");
  const contacts = await Contact.find({ phone: { $regex: "^8" } }).exec();
  console.log("outside test");
  res.status(200).json(contacts);
});

// @desc GET Individual contacts
// @route GET /api/contacts/:id
// @access private
const getIndividualContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  res.status(200).json(contact);
});

// @desc Create new Contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
  // console.log("this is body:", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandetory");
  }
  const user_id = req.user.id;
  const contactsOfUser = await Contact.find({ user_id: user_id });
  const phoneNoExists = contactsOfUser.some((con) => con.phone === phone);
  if (phoneNoExists) {
    console.log("A user with the following details exists");
    res.status(400);
    throw new Error(
      "You already have a contact with the same phone number" + phoneNoExists
    );
  }

  const contact = await Contact.create({
    name: name,
    email: email,
    phone: phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

// @desc Update a Contact
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
  // check if a contact exists
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  // make sure user owns the contact
  if (contact.user_id.toString() !== req.user.id) {
    res.status(400);
    console.log(contact.user_id.toString(), req.user.id);
    throw new Error(
      "User Not authorized to perform actions on other user's data"
    );
  }
  console.log(contact.user_id.toString(), req.user.id);
  // User can only update their own contact
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

// @desc Delete a Contact
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  // make sure user owns the contact
  if (contact.user_id.toString() !== req.user.id) {
    res.status(400);
    console.log(contact.user_id.toString(), req.user.id);
    throw new Error(
      "User Not authorized to perform actions on other user's data"
    );
  }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getIndividualContacts,
  createContact,
  updateContact,
  deleteContact,
  test,
};
