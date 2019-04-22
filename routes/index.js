var express = require("express");
require("dotenv").config();
var repository = require("../services/repository");
var router = express.Router();
var config = require("./config.json");
var dedup = require("../services/dedup");
var _ = require("lodash");
var ExecTimer = require("../services/execTimer");

/* GET home page. */
router.get("/", function (req, res) {
	res.render("index", {
		title: "Express"
	});
});

function aggregateTimer(t) {
	var aggregateTimers = [];
	_.each(t.timers, function (tmr, key) {
		aggregateTimers.push({
			name: key,
			count: tmr.count(), // number of ticks
			duration: tmr.parse(tmr.duration()), // total duration of all ticks
		});
	});
	return aggregateTimers;
}

router.post("/contact/seed/riak", async function (req, res) {
	var t = new ExecTimer();
	var self = this;
	self.Tick = t.Tick;
	var mainTick = new self.Tick("contactSeed");
	var dedupTick = new self.Tick("dedup");
	var saveTick = new self.Tick("save");
	mainTick.start();
	var id = req.body["external_contact_id_s"];
	var contactConfig = config.contacts;
	try {
		dedupTick.start();
		await dedup.createDedupeFields(req.body);
		dedupTick.stop();
		saveTick.start();
		var data = await repository.save(id, contactConfig.bucket,
			contactConfig.bucketType, req.body);
		saveTick.stop();
		mainTick.stop();
		res.status(200).json({
			data: data,
			timers: aggregateTimer(t)
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/account/seed/riak", async function (req, res) {
	var t = new ExecTimer();
	var self = this;
	self.Tick = t.Tick;
	var id = req.body["external_contact_id_s"];
	var accountConfig = config.accounts;
	var mainTick = new self.Tick("accountGet");
	mainTick.start();
	try {
		var data = await repository.save(id, accountConfig.bucket,
			accountConfig.bucketType, req.body);
		mainTick.stop();
		res.status(200).json({
			data: data,
			timers: aggregateTimer(t)
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.get("/contact/:id/riak", async function (req, res) {
	var t = new ExecTimer();
	var self = this;
	self.Tick = t.Tick;
	var id = req.params.id;
	var contactConfig = config.contacts;
	var mainTick = new self.Tick("contactGet");
	mainTick.start();
	try {
		var data = await repository.get(id, contactConfig.bucket,
			contactConfig.bucketType);
		mainTick.stop();
		res.status(200).json({
			data: data,
			timers: aggregateTimer(t)
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/contact/update/riak", async function (req, res) {
	var t = new ExecTimer();
	var self = this;
	self.Tick = t.Tick;
	var id = req.body["external_contact_id_s"];
	var contactConfig = config.contacts;
	var mainTick = new self.Tick("contactUpdate");
	var updateTick = new self.Tick("update");
	var dedupTick = new self.Tick("dedup");
	mainTick.start();
	try {
		updateTick.start();
		var {
			previousData,
			updatedData,
			contactUpdateTimers
		} = await repository.update(id, contactConfig.bucket,
			contactConfig.bucketType, req.body);
		updateTick.stop();
		if (previousData && updatedData) {
			dedupTick.start();
			var dedupTimers = await dedup.updateDedupeFields(previousData, updatedData);
			dedupTick.stop();
		}
		mainTick.stop();

		_.merge(t, contactUpdateTimers, dedupTimers);
		res.status(200).json({
			updatedData: updatedData,
			timers: aggregateTimer(t)
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/contact/dedup/riak", async function (req, res) {
	var t = new ExecTimer();
	var self = this;
	self.Tick = t.Tick;
	var mainTick = new self.Tick("contactDedup");
	try {
		mainTick.start();
		var dedupResult = await dedup.checkDedupeFields(req.body);
		mainTick.stop();
		res.status(200).json({
			dedupResult: dedupResult,
			timers: aggregateTimer(t)
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

router.post("/contact/upsert/riak", async function (req, res) {
	var t = new ExecTimer();
	var self = this;
	self.Tick = t.Tick;
	var mainTick = new self.Tick("contactUpsert");
	var getInitialTick = new self.Tick("contactInitialGet");
	var updateContactTick = new self.Tick("updateContact");
	var insertContactTick = new self.Tick("insertContact");
	var saveDedupTick = new self.Tick("saveDedup");
	var updateDedupTick = new self.Tick("updateDedup");
	var saveContactTick = new self.Tick("saveContact");
	mainTick.start();
	var id = req.body["external_contact_id_s"];
	var contactConfig = config.contacts;
	try {
		getInitialTick.start();
		var isContactExist = await repository.get(id, contactConfig.bucket,
			contactConfig.bucketType);
		getInitialTick.stop();
		if (isContactExist) {
			updateContactTick.start();
			var {
				previousData,
				updatedData,
				contactUpdateTimers
			} = await repository.update(id, contactConfig.bucket,
				contactConfig.bucketType, req.body);
			if (previousData && updatedData) {
				updateDedupTick.start();
				var dedupTimers = await dedup.updateDedupeFields(previousData, updatedData);
				updateDedupTick.stop();
			}
			updateContactTick.stop();
		} else {
			insertContactTick.start();
			saveDedupTick.start();
			await dedup.createDedupeFields(req.body);
			saveDedupTick.stop();
			saveContactTick.start();
			var data = await repository.save(id, contactConfig.bucket,
				contactConfig.bucketType, req.body);
			saveContactTick.stop();
			insertContactTick.stop();
		}
		mainTick.stop();
		_.merge(t, contactUpdateTimers, dedupTimers);
		res.status(200).json({
			data: updatedData || data,
			timers: aggregateTimer(t)
		});
	} catch (err) {
		res.status(500).json({
			"error": err
		});
	}
});

module.exports = router;