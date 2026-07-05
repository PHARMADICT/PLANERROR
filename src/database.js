const Database = require('better-sqlite3');
const path = require('path');

// Initialise the local database file
const dbPath = path.join(__dirname, 'shelfrx.db');
const db = new Database(dbPath);

// Create required tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS AppSettings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT
  );

  CREATE TABLE IF NOT EXISTS Racks (
    rack_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rack_name TEXT,
    theme_colour TEXT
  );

  CREATE TABLE IF NOT EXISTS Products (
    product_code TEXT PRIMARY KEY,
    barcode TEXT UNIQUE,
    description TEXT,
    shelf_id TEXT,
    stock_quantity INTEGER,
    expiry_date DATE,
    custom_fields TEXT
  );
`);

// Function to fetch products based on shelf filter
function getProductsByShelf(shelfId) {
  const stmt = db.prepare('SELECT * FROM Products WHERE shelf_id = ?');
  return stmt.all(shelfId);
}

// Function to update stock count
function updateStock(barcode, quantity) {
  const stmt = db.prepare('UPDATE Products SET stock_quantity = ? WHERE barcode = ?');
  return stmt.run(quantity, barcode);
}

module.exports = {
  db,
  getProductsByShelf,
  updateStock
};
