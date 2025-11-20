import express from 'express';
import asyncHandler from 'express-async-handler';
import * as controller from '../controller/controller.js';
import * as userController from '../controller/user.js';

const router = express.Router();

router.get('/entries', asyncHandler(controller.getEverything));

router.get('/user/:id', asyncHandler(controller.getUser));
router.get('/entries/:user_id', asyncHandler(controller.getAllEntries));
router.get('/entry/:entry_id', asyncHandler(controller.getEntry));
router.get('/entry/:entry_id/user/:user_id', asyncHandler(controller.getUserEntry));
router.get('/locations/:user_id', asyncHandler(controller.getUserLocations));
router.get('/location/:location_id/user/:user_id', asyncHandler(controller.getUserLocation));

router.post('/entry', asyncHandler(controller.insertEntryForUser));
router.patch('/entry/:entry_id/user/:user_id', controller.updateEntryFromUser);
router.patch('/location/:location_id/user/:user_id', controller.updateLocation);

router.delete('/entry/:entry_id/user/:user_id', asyncHandler(controller.deleteEntryFromUser));
router.delete('/location/:location_id/user/:user_id', asyncHandler(controller.deleteLocation));

// USER
router.post('/auth/user/signup', userController.signup);
router.post('/auth/user/signin', userController.signin);

// USER ACTIONS
router.post('/user/signout', userController.signout);
router.delete('/user/delaccount/:userId', userController.delAccount);
router.patch('/user/update-password/:userId', userController.updatePassword);
router.patch('/user/update-name/:userId', userController.updateName);

export default router;
