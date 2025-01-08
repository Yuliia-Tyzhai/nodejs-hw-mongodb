import { Router } from 'express';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import * as contactsControllers from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';

const router = Router();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(contactsControllers.getContactsController));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

router.post('/contacts', validateBody(contactAddSchema), ctrlWrapper(contactsControllers.addContactController));

router.patch('/contacts/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactsControllers.patchContactController));

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(contactsControllers.deleteContactController));

export default router;