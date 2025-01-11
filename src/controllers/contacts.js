import createHttpError from 'http-errors';

import * as contactsServices from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { parseSortParams } from '../utils/parseSortParams.js';

import { parseContactFilterParams } from "../utils/filters/parseContactFilterParams.js";


export const getContactsController = async (req, res) => {
  const {page, perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parseSortParams(req.query);
  // const filter = parseContactFilterParams(req.query);
  // filter.userId = req.user._id;
  const filter = { userId: req.user._id };


  const contacts = await contactsServices.getAllContacts({page, perPage, sortBy, sortOrder, filter});

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};


export const getContactByIdController = async (req, res) => {
  const {_id: userId} = req.user;
  const {contactId: _id} = req.params;
  const contact = await contactsServices.getContact({_id, userId});

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
    // const error = new Error('Contact not found');
    // error.status = 404;
    // throw error;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
const {_id: userId} = req.user;

  const data = await contactsServices.addContact({...req.body, userId});

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const {contactId: _id} = req.params;
  const {_id: userId} = req.user;
  const result = await contactsServices.updateContact({_id, userId}, req.body);

  if(!result) {
    throw createHttpError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result,
 });
};

export const deleteContactController = async(req, res) => {
  const {contactId: _id} = req.params;
  const {_id: userId} = req.user;
  const data = await contactsServices.deleteContact({_id, userId});

  if(!data) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};