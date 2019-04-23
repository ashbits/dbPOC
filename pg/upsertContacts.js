const pg = require('pg');
const Contact = require('./Contact.js');
const contactsPayload = require('./contactsData.js');
const contactTransform = require('./contactTransform.js');
const config = require('./config.js');

async function run() {
  let client;
  let configValue = config();
  try {
  	client = new pg.Client(configValue);
  	await client.connect();
    for (contactItemRaw of contactsPayload) {
      let contactItem = contactTransform(contactItemRaw);
      let accountquery = `SELECT company_external_id from accounts WHERE ${ "'" +  contactItem.display_avk_id + "'" } = accounts.company_external_id;`;
      let accountRows = await client.query(accountquery);
      let accountResult = accountRows.rows;
      console.log(accountResult);
      if (accountResult.length) {
        let query = Contact.update(contactsPayload).toQuery();
        query.text = query.text + ` ON CONFLICT(external_contact_id) DO NOTHING`;
        console.log(query);
        let {rows} = await client.query(query);
        console.log('Value Inserted:-', rows);
      } else {
        console.error('Account not found');
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.end();
  }
}

run();