var express = require("express");
require("dotenv").config();
var repository = require("../services/repository");
var router = express.Router();
var config = require("./config.json");
var dedup = require("../services/dedup");
/* GET home page. */
router.get("/", function (req, res) {
	res.render("index", {
		title: "Express"
	});
});

router.post("/contact/seed/riak", async function (req, res) {
	var id = req.body["external_contact_id_s"];
	var contactConfig = config.contacts;
	try {
		await dedup.createDedupeFields(req.body);
		var data = await repository.save(id, contactConfig.bucket,
			contactConfig.bucketType, req.body);
		res.status(200).json({
			data: data
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/account/seed/riak", async function (req, res) {
	var id = req.body["external_contact_id_s"];
	var accountConfig = config.accounts;
	try {
		var data = await repository.save(id, accountConfig.bucket,
			accountConfig.bucketType, req.body);
		res.status(200).json({
			data: data
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.get("/contact/:id/riak", async function (req, res) {
	var id = req.params.id;
	var contactConfig = config.contacts;
	try {
		var data = await repository.get(id, contactConfig.bucket,
			contactConfig.bucketType);
		res.status(200).json({
			data: data
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/contact/update/riak", async function (req, res) {
	var id = req.body["external_contact_id_s"];
	var contactConfig = config.contacts;
	try {
		var {previousData, updatedData} = await repository.update(id, contactConfig.bucket,
			contactConfig.bucketType, req.body);
		if(previousData && updatedData) {
			await dedup.updateDedupeFields(previousData, updatedData);
		}
		res.status(200).json(updatedData);
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/contact/dedup/riak", async function (req, res) {
	try {
		var dedupResult = await dedup.checkDedupeFields(req.body);
		res.status(200).json(dedupResult);
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/contact/upsert/riak", async function (req, res) {
	var id = req.body["external_contact_id_s"];
	var contactConfig = config.contacts;
	try {
		var isContactExist = await repository.get(id, contactConfig.bucket,
			contactConfig.bucketType);
		if (isContactExist) {
			var {previousData, updatedData} = await repository.update(id, contactConfig.bucket,
				contactConfig.bucketType, req.body);
			if(previousData && updatedData) {
				await dedup.updateDedupeFields(previousData, updatedData);
			}
		} else {
			await dedup.createDedupeFields(req.body);
			var data = await repository.save(id, contactConfig.bucket,
				contactConfig.bucketType, req.body);
		}
		res.status(200).json({
			data : updatedData || data
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

module.exports = router;
