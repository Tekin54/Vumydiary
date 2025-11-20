import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import * as model from '../model/user.js';
import * as validator from '../validators/validator.js';

dotenv.config();

const salt = bcrypt.genSaltSync(10);

const signup = async (req, res) => {
  await Promise.all(validator.validateSignup.map((v) => v.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newUser = {
    firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
    lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
    email: req.body.email.toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hashedPassword: bcrypt.hashSync(req.body.password, salt),
  };

  try {
    // Wir ignorieren hier, ob Model rows zurückgibt oder nicht
    const result = await model.signup(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.createdAt,
      newUser.updatedAt,
      newUser.hashedPassword,
    );

    const userData = Array.isArray(result) ? result[0] : result?.rows?.[0];

    return res.status(201).json({
      status: 'SUCCESS',
      message: `Account für ${req.body.email} wurde erfolgreich erstellt.`,
      user: userData || null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  await Promise.all(validator.validateSignin.map((v) => v.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };

  try {
    const result = await model.signin(user.email);

    // Sicherstellen, dass wir das User-Objekt korrekt greifen
    const userData = Array.isArray(result) ? result[0] : result?.rows?.[0];

    if (!userData) {
      return res.status(401).json({ message: 'Email is incorrect' });
    }

    const passwordMatch = bcrypt.compareSync(user.password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    return res.status(200).json({ message: 'User logged in', user: userData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signout = (req, res) => {
  res.status(200).json({ message: 'User logged out' });
};

const delAccount = async (req, res) => {
  const { userId } = req.params;
  await model.delAccount(userId);
  return res.status(200).end();
};

const updatePassword = async (req, res) => {
  await Promise.all(validator.validateUpdatePassword.map((v) => v.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = {
    userId: Number(req.params.userId),
    password: req.body.oldPassword,
    newPassword: req.body.newPassword,
  };

  try {
    const result = await model.getUserById(user.userId);
    const userData = Array.isArray(result) ? result[0] : result?.rows?.[0];

    if (!userData) return res.status(401).json({ message: 'User not found' });

    const passwordMatch = bcrypt.compareSync(user.password, userData.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid Password' });

    const hashedPassword = bcrypt.hashSync(user.newPassword, salt);
    const updatedResult = await model.updatePassword(user.userId, hashedPassword);
    const updatedUser = Array.isArray(updatedResult) ? updatedResult[0] : updatedResult?.rows?.[0];

    return res.status(200).json({ message: 'Password updated', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateName = async (req, res) => {
  await Promise.all(validator.validateUpdateName.map((v) => v.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const user = {
    userId: Number(req.params.userId),
    firstName: req.body.newFirstName,
    lastName: req.body.newLastName,
    password: req.body.password,
  };

  try {
    const result = await model.getUserById(user.userId);
    const userData = Array.isArray(result) ? result[0] : result?.rows?.[0];

    if (!userData) return res.status(401).json({ message: 'User not found' });

    const passwordMatch = bcrypt.compareSync(user.password, userData.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid Password' });

    if (user.firstName === userData.first_name && user.lastName === userData.last_name) {
      return res.status(401).json({ message: 'New name is the same as the old one' });
    }

    const updatedResult = await model.updateName(user.userId, user.firstName, user.lastName);
    const updatedUser = Array.isArray(updatedResult) ? updatedResult[0] : updatedResult?.rows?.[0];

    return res.status(200).json({ message: 'Name updated', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { signup, signin, signout, updatePassword, updateName, delAccount };
