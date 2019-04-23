const sql = require('sql');

let Contact = sql.define({
  name: 'contacts',
  columns: [
    "external_contact_id",
    "address_line_1",
    "address_line_2",
    "alias",
    "city",
    "country",
    "created_at",
    "current_company",
    "current_department",
    "current_direct_phone",
    "current_email",
    "current_job_function",
    "current_job_level",
    "current_phone",
    "current_title",
    "destination_tag",
    "email_domain",
    "email_pattern",
    "error_code",
    "first_name",
    "gmail_bounce_date",
    "gmail_bounce_status",
    "heat_index",
    "inactive",
    "internal_updated_at",
    "last_name",
    "last_synced",
    "linkedin_url",
    "purchased_by_client",
    "rl_job_function",
    "source",
    "state",
    "status",
    "updated_at",
    "imported_by",
    "zipcode"
  ]
});

module.exports = Contact;