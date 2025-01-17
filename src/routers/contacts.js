import { Router } from 'express';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

import * as contactsControllers from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';

const router = Router();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(contactsControllers.getContactsController));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

router.post('/contacts', upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactsControllers.addContactController));

router.patch('/contacts/:contactId', upload.single('photo'), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactsControllers.patchContactController));

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(contactsControllers.deleteContactController));

export default router;