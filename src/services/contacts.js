import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
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