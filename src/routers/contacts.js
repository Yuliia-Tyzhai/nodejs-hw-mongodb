import { Router } from 'express';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

import * as contactsControllers from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/contacts', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/contacts', upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactsControllers.addContactController));

contactsRouter.patch('/contacts/:contactId', upload.single('photo'), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactsControllers.patchContactController));

contactsRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(contactsControllers.deleteContactController));

export default contactsRouter;