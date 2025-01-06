import { ContactsCollection } from '../db/models/contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getAllContacts = async ({page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc",}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const contacts = await ContactsCollection.find().skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();
  const totalItems = await ContactsCollection.countDocuments();

  const paginationData = calcPaginationData({totalItems, page, perPage});

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const addContact = data => ContactsCollection.create(data);

export const updateContact = (contactId, data, options = {new: true}) => {
  return ContactsCollection.findOneAndUpdate(
    {_id: contactId},
    data,
    options,
  );
};

export const deleteContact = filter => ContactsCollection.findOneAndDelete(filter);