const pg = require('pg');
const config = require('./config.js');


async function createContactTable () {
	let client;
	let configValue = config();
  	try {
	    client = new pg.Client(configValue);
		await client.connect()

		let query = await client.query(
		  `CREATE TABLE contacts(
			  "id" SERIAL,
			  "external_contact_id" VARCHAR(20) NOT NULL UNIQUE,
			  "address_line_1" VARCHAR(150),
			  "address_line_2" VARCHAR(150),
			  "alias" TEXT [],
			  "city" VARCHAR(50),
			  "country" VARCHAR(50),
			  "created_at" TIMESTAMPTZ,
			  "current_company" VARCHAR(20),
			  "current_department" VARCHAR(150),
			  "current_direct_phone" VARCHAR(50),
			  "current_email" VARCHAR(50),
			  "current_job_function" VARCHAR(50),
			  "current_job_level" VARCHAR(50),
			  "current_phone" VARCHAR(50),
			  "current_title" VARCHAR(100),
			  "destination_tag" TEXT [],
			  "email_domain" VARCHAR(50),
			  "email_pattern" VARCHAR(50),
			  "error_code" VARCHAR(50),
			  "first_name" VARCHAR(50),
			  "gmail_bounce_date" TIMESTAMPTZ,
			  "gmail_bounce_status" VARCHAR(50),
			  "heat_index" JSON,
			  "inactive" BOOL,
			  "internal_updated_at" TIMESTAMPTZ,
			  "last_name" VARCHAR(50),
			  "last_synced" JSON,
			  "linkedin_url" VARCHAR(100),
			  "purchased_by_client" TEXT [],
			  "rl_job_function" TEXT [],
			  "source" VARCHAR(50),
			  "state" VARCHAR(50),
			  "status" VARCHAR(50),
			  "updated_at" TIMESTAMPTZ,
			  "imported_by" VARCHAR(50),
			  "zipcode" VARCHAR(50),
			  PRIMARY KEY ("id"),
			  FOREIGN KEY (current_company) REFERENCES accounts (external_id)
		  );`
		);
  	} catch (e) {
  		console.error('Table Creation Failed:', e);
  	} finally {
  		console.log('Done creating Table')
  		client.end()
  	}
}

createContactTable();