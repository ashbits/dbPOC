const pg = require('pg');
const Contact = require('./Contact.js');

let contactsToInsert = [{
  email: 'test@example.com',
  name: 'Fred'
}, {
  email: 'test2@example.com',
  name: 'Lynda'
}];

async function run() {
  let client;
  try {
  	client = new pg.Client({
  	  user: 'me',
  	  host: 'localhost',
  	  database: 'api',
  	  password: 'password',
  	  port: 5432,
  	})
  	await client.connect()
    let query = Contact.insert(contactsToInsert).returning(Contact.id).toQuery();
    console.log(query);
    let {rows} = await client.query(query);
    console.log(rows);
  } catch (e) {
  } finally {
    client.end();
  }
}

run();