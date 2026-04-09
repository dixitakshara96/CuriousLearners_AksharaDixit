// utils/store.js
// A simple local JSON file-based data store.
// All data is persisted in /data/*.json files.

const fs   = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read a collection from its JSON file.
 * Returns an empty array if the file doesn't exist yet.
 */
function readCollection(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

/**
 * Write an entire collection array back to disk.
 */
function writeCollection(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Find all documents matching a predicate.
 */
function find(collection, predicate) {
  return readCollection(collection).filter(predicate);
}

/**
 * Find one document matching a predicate.
 */
function findOne(collection, predicate) {
  return readCollection(collection).find(predicate) || null;
}

/**
 * Find by id field.
 */
function findById(collection, id) {
  return findOne(collection, (doc) => doc.id === id);
}

/**
 * Insert a new document. Returns the inserted document.
 */
function insert(collection, doc) {
  const data = readCollection(collection);
  data.push(doc);
  writeCollection(collection, data);
  return doc;
}

/**
 * Update documents matching a predicate using an updater function.
 * Returns the number of updated documents.
 */
function updateWhere(collection, predicate, updater) {
  const data = readCollection(collection);
  let count = 0;
  const updated = data.map((doc) => {
    if (predicate(doc)) {
      count++;
      return { ...doc, ...updater(doc) };
    }
    return doc;
  });
  writeCollection(collection, updated);
  return count;
}

/**
 * Update a single document by id.
 */
function updateById(collection, id, updates) {
  return updateWhere(collection, (d) => d.id === id, () => updates);
}

/**
 * Delete documents matching a predicate.
 */
function deleteWhere(collection, predicate) {
  const data = readCollection(collection);
  const remaining = data.filter((doc) => !predicate(doc));
  writeCollection(collection, remaining);
  return data.length - remaining.length;
}

/**
 * Get all documents in a collection.
 */
function getAll(collection) {
  return readCollection(collection);
}

module.exports = {
  find,
  findOne,
  findById,
  insert,
  updateWhere,
  updateById,
  deleteWhere,
  getAll,
};