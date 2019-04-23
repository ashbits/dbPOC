var express = require("express");
require("dotenv").config();
var router = express.Router();
var config = require("./config.json");
var contactInsert = require('../pg/insertContacts.js')
var accountInsert = require('../pg/insertAccounts.js')
var contactDedup = require('../pg/dedupContact.js')

let pgConfig = require('../pg/config.js');
const { Pool } = require('pg');
let postgresConfig = pgConfig();
const pool = new Pool(postgresConfig);

/* GET home page. */
router.get("/", function (req, res) {
	res.render("index", {
		title: "Express"
	});
});

router.post("/contact/seed/pg", async function (req, res) {
	var payload = req.body;
	try {
		let data = await contactInsert(payload, pool);
		res.status(200).json({
			data: data
		});
	} catch (e) {
		res.status(500).json({
			"error": e
		});
	}
});


router.post("/contact/dedup/pg", async function (req, res) {
	var payload = req.body;
	try {
		let data = await contactDedup(payload, pool);
		res.status(200).json({
			data: data
		});
	} catch (e) {
		res.status(500).json({
			"error": e
		});
	}
});

router.post("/account/seed/pg", async function (req, res) {
	var payload = req.body;
	try {
		let data = await accountInsert(payload, pool);
		res.status(200).json({
			data: data
		});
	} catch (e) {
		res.status(500).json({
			"error": e
		});
	}
});


module.exports = router;
