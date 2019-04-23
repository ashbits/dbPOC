const sql = require('sql');

let Account = sql.define({
  name: 'accounts',
  columns: [
	"external_id",
	"name",
	"website",
	"parent_id",
	"phone",
	"revenue_lower",
	"revenue_upper",
	"employees_lower",
	"employees_upper",
	"sic",
	"naics",
	"sic_description",
	"naics_description",
	"address",
	"industry",
	"subindustry",
	"alias",
	"source",
	"created_at",
	"updated_at",
	"inactive",
	"entity_type",
	"business_description",
	"status",
	"tags",
	"company_revenue",
	"employees_size"
  ]
});

module.exports = Account;