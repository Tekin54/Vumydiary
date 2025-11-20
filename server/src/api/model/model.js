/* eslint-disable camelcase */
import { query } from '../../db/index.js';

const getEverything = () => query('SELECT * FROM v_all_entries ORDER BY last_changed DESC;');

const gerUser = (user_id) =>
  query(
    `
SELECT
    user_id,
    first_name,
    last_name,
    email,
    created_at,
    updated_at
FROM users
WHERE user_id = $1;
`,
    [user_id],
  );

const getAllEntries = (user_id) =>
  query(
    `SELECT entry_id, title, description, mood, date, time, last_changed
FROM entries
WHERE user_id = $1;
`,
    [user_id],
  );

// Option 1 wenn man nur Entry haben will -----------
const getEntry = (entry_id) =>
  query(
    `SELECT entry_id, user_id, user_location_id, title, description, mood, date, time, last_changed
FROM entries
WHERE entry_id = $1;`,
    [entry_id],
  );
// OPtion 2 wenn man von dem User Entry haben will
const getUserEntry = (entry_id, user_id) =>
  query(
    `SELECT entry_id, user_id, user_location_id, title, description, mood, date, time, last_changed
     FROM entries
     WHERE entry_id = $1 AND user_id = $2;`,
    [entry_id, user_id],
  );
// beides dienen als Hilfe für Frontend ------------

const updateEntryFromUser = (entry_id, user_id, title, description, mood) =>
  query(
    `UPDATE entries
SET title = $3,
    description = $4,
    mood = $5
WHERE entry_id = $1 AND user_id = $2;`,
    [entry_id, user_id, title, description, mood],
  );

const insertEntryForUser = (user_id, user_location_id, title, description, mood) =>
  query(
    `INSERT INTO entries(user_id, user_location_id, title, description, mood)
VALUES ($1, $2, $3, $4, $5);
`,
    [user_id, user_location_id, title, description, mood],
  );

const deleteEntryFromUser = (entry_id, user_id) =>
  query(
    `DELETE FROM entries
WHERE entry_id = $1 AND user_id = $2;  -- nur eigener Eintrag
`,
    [entry_id, user_id],
  );

// Alle Locations eines Users MEHRZAHL
const getUserLocations = (user_id) =>
  query(
    `SELECT l.location_id, l.ort, l.strasse, l.plz, l.longitude, l.latitude
     FROM locations l
     JOIN user_locations ul ON l.location_id = ul.location_id
     WHERE ul.user_id = $1;`,
    [user_id],
  );
// Einzelne Location abrufen (nur eigene) EINZAHL
const getUserLocation = (location_id, user_id) =>
  query(
    `SELECT l.location_id, l.ort, l.strasse, l.plz, l.longitude, l.latitude
     FROM locations l
     JOIN user_locations ul ON l.location_id = ul.location_id
     WHERE l.location_id = $1 AND ul.user_id = $2;`,
    [location_id, user_id],
  );
// Location aktualisieren
const updateLocation = (user_id, location_id, ort, strasse, plz, longitude, latitude) =>
  query(
    `UPDATE locations
     SET ort = $3, strasse = $4, plz = $5, longitude = $6, latitude = $7
     WHERE location_id = $2
       AND location_id IN (
         SELECT location_id FROM user_locations WHERE user_id = $1
       )
     RETURNING location_id;`,
    [user_id, location_id, ort, strasse, plz, longitude, latitude],
  );
// Eigene Location löschen (nur, wenn keine Entries darauf referenzieren)
// Model
const deleteLocation = async (user_id, location_id) => {
  return query(`

    DELETE FROM user_locations
    WHERE user_id = ${user_id} AND location_id = ${location_id};


    DELETE FROM locations
    WHERE location_id = ${location_id}
      AND NOT EXISTS (
        SELECT 1 FROM user_locations WHERE location_id = ${location_id}
      )
      AND NOT EXISTS (
        SELECT 1 FROM entries WHERE user_location_id = ${location_id}
      )
    RETURNING location_id;
  `);
};

export {
  getUserLocations,
  deleteLocation,
  updateLocation,
  getUserLocation,
  getEverything,
  gerUser,
  getAllEntries,
  getUserEntry,
  insertEntryForUser,
  updateEntryFromUser,
  getEntry,
  deleteEntryFromUser,
};
