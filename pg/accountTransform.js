function acccountTransform (row) {
	let updatedRow = {
		"external_id": row['company_external_id_s'] || '',
	    "name": row['company_sst'] || '',
	    "website": row['website_eml'] || '',
	    "parent_id": row['display_avk_id_s'] || '',
	    "phone": row['phone_sst'] || '',
	    "revenue_lower": row['revenue_lower_l'] || '',
	    "revenue_upper": row['revenue_upper_l'] || '',
	    "employees_lower": row['employees_lower_l'] || '',
	    "employees_upper": row['employees_upper_l'] || '',
	    "sic": row['sic_sst'] || '',
	    "naics": row['naics_sst'] || '',
	    "sic_description": row['sic_description_sst'] || '',
	    "naics_description": row['naics_description_sst'] || '',
	    "address": {
	    	'company_address_line_1': row['company_address_line_1_t'] || '',
	    	'company_address_line_2': row['company_address_line_2_t'] || '',
	    	'company_city': row['company_city_sst'] || '',
	    	'company_state': row['company_state_sst'] || '',
	    	'company_country': row['company_country_sst'] || '',
	    	'company_zipcode': row['company_zipcode_sst'] || ''
	    },
	    "industry": row['industry_sst'] || '',
	    "subindustry": row['subindustry_sst'] || '',
	    "source": row['source_sst'] || '',
	    "created_at": row['created_at_dt'] || '',
	    "updated_at": row['updated_at_dt'] || '',
	    "inactive": row['inactive_b'] || null,
	    "entity_type": row['entity_type_s'] || '',
	    "status": row['status_s'] || '',
	    "company_revenue": row['company_revenue_l'] || '',
	    "employees_size": row['employees_size_l'] || ''
	};
	updatedRow["alias"] = row['alias_ss'] ? convertJSONString(row['alias_ss']) : null;

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

module.exports = acccountTransform;