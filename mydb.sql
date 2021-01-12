PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Customer (
  id INTEGER PRIMARY KEY ASC,
  fullName VARCHAR(60) UNIQUE
);
CREATE TABLE IF NOT EXISTS Purchase(
  id INTEGER PRIMARY KEY ASC,
  itemName VARCHAR(60),
  price INTEGER,
  customerId INTEGER,
  FOREIGN KEY (customerId) REFERENCES Customer(id)
);



