const path = require('path');
const sqlite = require('sqlite3');
const util = require('util');
const minimist = require('minimist');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'my.db');
const DB_SQL_PATH = path.join(__dirname, 'mydb.sql');

const args = minimist(process.argv.slice(2), {
  string: ['customerName', 'itemName'],
  number: ['price'],
});

async function main() {
  const { customerName, itemName, price } = args;
  if (!customerName || !itemName || !price) {
    error('customerName, itemName, and price is required argument for script');
  }

  const myDB = new sqlite.Database(DB_PATH);

  const SQL3 = {
    run(...args) {
      return new Promise(function (resolve, reject) {
        myDB.run(...args, function (err) {
          if (err) reject(err);
          resolve(this);
        });
      });
    },
    get: util.promisify(myDB.get.bind(myDB)),
    all: util.promisify(myDB.all.bind(myDB)),
    exec: util.promisify(myDB.exec.bind(myDB)),
  };

  const initSQL = fs.readFileSync(DB_SQL_PATH, 'utf8');
  // console.log(initSQL);
  await SQL3.exec(initSQL);
  console.log('success');
  // Check if the customer exist or add new customer
  const customerId = await insertOrLookupCustomer(customerName);
  if (customerId) {
    console.log(`customerId = ${customerId}`);

    const purchaseId = await insertPurchase(customerId, itemName, price);
    if (purchaseId) {
      const records = await getAllRecords();
      console.table(records);
    }
  }

  async function insertOrLookupCustomer(fullName) {
    const GET_CUSTOMER_QUERY = `SELECT id from Customer WHERE fullName = ?`;
    const INSERT_CUSTOMER_QUERY = `INSERT into Customer (fullName) VALUES(?)`;

    let result = await SQL3.get(GET_CUSTOMER_QUERY, fullName);
    if (result && result.id) {
      return result.id;
    } else {
      result = await SQL3.run(INSERT_CUSTOMER_QUERY, fullName);
      if (result && result.lastID) {
        return result.lastID;
      }
    }
  }

  async function insertPurchase(customerId, itemName, price) {
    const INSERT_PURCHASE_QUERY = `INSERT into Purchase (customerId, itemName, price) VALUES(?,?,?)`;
    const result = await SQL3.run(
      INSERT_PURCHASE_QUERY,
      customerId,
      itemName,
      price
    );
    if (result && result.lastID) {
      return result.lastID;
    }
  }

  async function getAllRecords() {
    const GET_ALL_RECORDS_QUERY = `
    SELECT
    Customer.id as 'customerId',
    Customer.fullName as 'customerName',
    Purchase.itemName as 'item',
    Purchase.price as 'price',
    Purchase.id as 'purchaseId' 
 FROM
    Customer 
    JOIN
       Purchase 
       ON (Customer.id = Purchase.customerId) 
 ORDER BY
    Purchase.id ASC
  `;

    const results = await SQL3.all(GET_ALL_RECORDS_QUERY);
    if (results && results.length) {
      return results;
    }
  }
}

main().catch((err) => {
  console.error(err);
});

function error(msg) {
  console.error(msg);
}
