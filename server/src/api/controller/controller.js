/* eslint-disable camelcase */
import chalk from 'chalk';
import * as model from '../model/model.js';

const getEverything = async (req, res) => {
  try {
    const { rows } = await model.getEverything();
    console.log(chalk.green('Alle Einträge erfolgreich abgerufen.'));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen aller Einträge:'), error);
    res.status(500).send('Fehler beim Abrufen aller Einträge.');
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await model.gerUser(id);
    console.log(chalk.green(`User ${id} erfolgreich abgerufen.`));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen des Users:'), error);
    res.status(500).send('Fehler beim Abrufen des Users.');
  }
};

const getAllEntries = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rows } = await model.getAllEntries(user_id);
    console.log(chalk.green(`Alle Entries für User ${user_id} abgerufen.`));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen der User-Entries:'), error);
    res.status(500).send('Fehler beim Abrufen der User-Entries.');
  }
};

const getEntry = async (req, res) => {
  try {
    const { entry_id } = req.params;
    const { rows } = await model.getEntry(entry_id);
    console.log(chalk.green(`Entry ${entry_id} erfolgreich abgerufen.`));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen des Eintrags:'), error);
    res.status(500).send('Fehler beim Abrufen des Eintrags.');
  }
};
const getUserEntry = async (req, res) => {
  try {
    const { entry_id, user_id } = req.params;
    const { rows } = await model.getUserEntry(entry_id, user_id);
    console.log(chalk.green(`Entry ${entry_id} für User ${user_id} erfolgreich abgerufen.`));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen des User-Eintrags:'), error);
    res.status(500).send('Fehler beim Abrufen des User-Eintrags.');
  }
};

const updateEntryFromUser = async (req, res) => {
  try {
    const { entry_id, user_id } = req.params;
    const { title, description, mood } = req.body;

    if (!title && !description && !mood) {
      return res.status(400).send('Bitte mindestens ein Feld zum Aktualisieren angeben.');
    }

    await model.updateEntryFromUser(entry_id, user_id, title, description, mood);

    console.log(chalk.yellow(`Entry ${entry_id} von User ${user_id} aktualisiert.`));
    return res.status(200).send(`Entry ${entry_id} wurde erfolgreich aktualisiert.`);
  } catch (error) {
    console.log(chalk.red('Fehler beim Aktualisieren des Eintrags:'), error);
    res.status(500).send('Fehler beim Aktualisieren des Eintrags.');
  }
};

const insertEntryForUser = async (req, res) => {
  try {
    const { user_id, user_location_id, title, description, mood } = req.body;
    const { rows } = await model.insertEntryForUser(
      user_id,
      user_location_id,
      title,
      description,
      mood,
    );
    console.log(chalk.green(`Neuer Eintrag für User ${user_id} hinzugefügt.`));
    res.status(201).send(`Eintrag wurde erstellt. ID: ${rows[0]?.entry_id || 'unbekannt'}`);
  } catch (error) {
    console.log(chalk.red('Fehler beim Hinzufügen des Eintrags:'), error);
    res.status(500).send('Fehler beim Hinzufügen des Eintrags.');
  }
};

const deleteEntryFromUser = async (req, res) => {
  try {
    const { entry_id, user_id } = req.params;
    await model.deleteEntryFromUser(entry_id, user_id);
    console.log(chalk.red(`Entry ${entry_id} von User ${user_id} wurde gelöscht.`));
    res.status(200).send(`Eintrag ${entry_id} wurde gelöscht.`);
  } catch (error) {
    console.log(chalk.red('Fehler beim Löschen des Eintrags:'), error);
    res.status(500).send('Fehler beim Löschen des Eintrags.');
  }
};

const getUserLocations = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rows } = await model.getUserLocations(user_id);
    console.log(chalk.green(`Alle Locations für User ${user_id} abgerufen.`));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen der Locations:'), error);
    res.status(500).send('Fehler beim Abrufen der Locations.');
  }
};

const getUserLocation = async (req, res) => {
  try {
    const { location_id, user_id } = req.params;
    const { rows } = await model.getUserLocation(location_id, user_id);
    console.log(chalk.green(`Location ${location_id} für User ${user_id} abgerufen.`));
    res.status(200).send(rows);
  } catch (error) {
    console.log(chalk.red('Fehler beim Abrufen der Location:'), error);
    res.status(500).send('Fehler beim Abrufen der Location.');
  }
};

const updateLocation = async (req, res) => {
  try {
    const { location_id, user_id } = req.params;
    const { ort, strasse, plz, longitude, latitude } = req.body;

    if (!ort && !strasse && !plz && !longitude && !latitude) {
      return res.status(400).send('Bitte mindestens ein Feld zum Aktualisieren angeben.');
    }

    await model.updateLocation(user_id, location_id, ort, strasse, plz, longitude, latitude);

    console.log(chalk.yellow(`Location ${location_id} von User ${user_id} aktualisiert.`));
    res.status(200).send(`Location ${location_id} wurde erfolgreich aktualisiert.`);
  } catch (error) {
    console.log(chalk.red(' Fehler beim Aktualisieren der Location:'), error);
    res.status(500).send('Fehler beim Aktualisieren der Location.');
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { user_id, location_id } = req.params;
    const rows = await model.deleteLocation(user_id, location_id);
    console.log(`Location ${location_id} für User ${user_id} gelöscht (falls möglich).`);
    res
      .status(200)
      .send(
        `Location ${
          rows[0]?.location_id || location_id
        } wurde gelöscht .`,
      );
  } catch (error) {
    console.log('Fehler beim Löschen der Location:', error);
    res.status(500).send('Fehler beim Löschen der Location.');
  }
};

export {
  getEverything,
  getUser,
  getAllEntries,
  getEntry,
  getUserEntry,
  updateEntryFromUser,
  insertEntryForUser,
  deleteEntryFromUser,
  getUserLocations,
  getUserLocation,
  updateLocation,
  deleteLocation,
};
