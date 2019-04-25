function contactTransform (row) {
	var updatedRow = {
		"external_contact_id": row['external_contact_id_s'] || '',
		"address_line_1": row['address_line_1_t'] || '',
		"address_line_2": row['address_line_2_t'] || '',
		"city": row['city_sst'] || '',
		"country": row['country_sst'] || '',
		"created_at": row['created_at_dt'] || '',
		"current_company": row['display_avk_id_s'] || '',
		"current_department": row['current_department_sst'] || '',
		"current_direct_phone": row['current_direct_phone_sst'] || '',
		"current_email": row['current_email_eml'] || '',
		"current_job_function": row['current_job_function_sst'] || '',
		"current_job_level": row['current_job_level_sst'] || '',
		"current_phone": row['current_phone_sst'] || '',
		"current_title": row['current_title_sst'] || '',
		"email_domain": row['email_domain_s'] || '',
		"email_pattern": row['email_pattern_s'] || '',
		"error_code": row['error_code_s'] || '',
		"first_name": row['first_name_sst'] || '',
		"last_name": row['last_name_sst'] || '',
		"inactive": row['inactive_b'] || null,
		"internal_updated_at": row['internal_updated_at_dt'] || '',
		"linkedin_url": row['linkedin_url_eml'] || '',
		"source": row['source_sst'] || '',
		"state": row['state_sst'] || '',
		"status": row['status_s'] || '',
		"updated_at": row['updated_at_dt'] || '',
		"imported_by": row['user_s'] || '',
		"zipcode": row['zipcode_sst'] || '',
	};
	updatedRow["alias"] = row['alias_ss'] ? convertJSONString(row['alias_ss']) : null;
	updatedRow["destination_tag"] = row['destination_tag_ss'] ? convertJSONString(row['destination_tag_ss']) : null;
	updatedRow["purchased_by_client"] = row['purchased_by_client_ss'] ? convertJSONString(row['purchased_by_client_ss']) : null;
	updatedRow["rl_job_function"] = row['rl_job_function_ss'] ? convertJSONString(row['rl_job_function_ss']) : null;
	updatedRow["heat_index"] = row['heat_index'] ? convertJSONString(row['heat_index']) : null;

	var finalMap = {};
	Object.keys(updatedRow).forEach((item)=>{
		if (updatedRow[item] !== "" && updatedRow[item] !== null) {
			finalMap[item] = updatedRow[item];
		}
	});
	return finalMap;
}

function convertJSONString (str) {
	var finalArray = str;
	finalArray = finalArray.replace(/'/g, '"');
	try {
		finalArray = JSON.parse(finalArray);
	} catch (e) {
		console.error(e);
		return null;
	}
	return finalArray;
}

module.exports = contactTransform;