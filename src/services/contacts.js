import { ContactsCollection } from '../db/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getAllContacts = async ({page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filter = {},}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  const contactsQuery = ContactsCollection.find();

  if(filter.userId) {
    contactsQuery.where("userId").equals(filter.userId);
}

  const contacts = await ContactsCollection.find().skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();
  const totalItems = await ContactsCollection.countDocuments();

  const paginationData = calcPaginationData({totalItems, page, perPage});

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const getContact = filter => ContactsCollection.findOne(filter);

export const addContact = data => ContactsCollection.create(data);

export const updateContact = (filter, data, options = {new: true}) => {
  return ContactsCollection.findOneAndUpdate(
    filter,
    data,
    options,
  );
};

export const deleteContact = filter => ContactsCollection.findOneAndDelete(filter);