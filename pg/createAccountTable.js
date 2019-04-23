const pg = require('pg');
const config = require('./config.js');


async function createAccountTable () {
	let client;
	let configValue = config();
  	try {
	    client = new pg.Client(configValue);
		await client.connect()

		let query = await client.query(
		  	`CREATE TABLE accounts(
				"id" SERIAL,
			    "external_id" VARCHAR(20) NOT NULL UNIQUE,
			    "name" VARCHAR(100),
			    "website" VARCHAR(100),
			    "parent_id" VARCHAR(20),
			    "phone" VARCHAR(20),
			    "revenue_lower" BIGSERIAL,
			    "revenue_upper" BIGSERIAL,
			    "employees_lower" SERIAL,
			    "employees_upper" SERIAL,
			    "sic" VARCHAR(6),
			    "naics" VARCHAR(6),
			    "sic_description" VARCHAR(100),
			    "naics_description" VARCHAR(100),
			    "address" JSON,
			    "industry" VARCHAR(100),
			    "subindustry" VARCHAR(100),
			    "alias" TEXT [],
			    "source" VARCHAR(100),
			    "created_at" TIMESTAMPTZ,
			    "updated_at" TIMESTAMPTZ,
			    "inactive" BOOL,
			    "entity_type" VARCHAR(100),
			    "business_description" VARCHAR(100),
			    "status" VARCHAR(100),
			    "tags" TEXT [],
			    "company_revenue" VARCHAR(100),
			    "employees_size" TEXT,
			    PRIMARY KEY ("id")
			);`
		);
	} catch (e) {
		console.error('Table Creation Failed:', e);
	} finally {
		console.log('Done creating Table')
		client.end()
	}
}

createAccountTable();