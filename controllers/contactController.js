const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// @desc GET all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
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
  console.log(phone);
  Contact.exists({ phone: phone }, (err, res) => {
    if (res) {
      console.log(res);
      res.status(400);
      throw new Error("You already have a contact with the same phone number");
    }
    if (err) {
      console.log("Error in checking for existing contact");
    }
  });

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
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
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
  await Contact.deleteOne();
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getIndividualContacts,
  createContact,
  updateContact,
  deleteContact,
};
