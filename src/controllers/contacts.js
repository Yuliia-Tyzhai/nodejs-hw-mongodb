import createHttpError from 'http-errors';

import * as contactsServices from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { parseSortParams } from '../utils/parseSortParams.js';


export const getContactsController = async (req, res) => {
  const {page, perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parseSortParams(req.query);

  const contacts = await contactsServices.getAllContacts({page, perPage, sortBy, sortOrder});

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};


export const getContactByIdController = async (req, res) => {
  const {contactId} = req.params;
  const contact = await contactsServices.getContactsById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
    // const error = new Error('Contact not found');
    // error.status = 404;
    // throw error;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const data = await contactsServices.addContact(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const {contactId} = req.params;
  const result = await contactsServices.updateContact(contactId, req.body);

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
  const {contactId} = req.params;
  const data = await contactsServices.deleteContact({_id: contactId});

  if(!data) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};