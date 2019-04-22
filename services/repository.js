var Riak = require("basho-riak-client");
var _ = require("lodash");
var nodes = process.env.RIAK_NODES + ":8087";
var nodeArray = nodes.split(",");
var ExecTimer = require("./execTimer");

class Repository {
	constructor() {
		this.client = new Riak.Client(nodeArray);
	}

	save(id, bucket, bucketType, value) {
		var self = this;
		return new Promise((resolve, reject) => {
			var riakObj = new Riak.Commands.KV.RiakObject();
			riakObj.setContentType("application/json");
			riakObj.setBucketType(bucketType);
			riakObj.setBucket(bucket);
			riakObj.setKey(id);
			riakObj.setValue(value);

			self.client.storeValue({
				returnBody: true,
				value: riakObj
			},
			function (err, rslt) {
				if (err) {
					return reject(err);
				}
				if (rslt.values) {
					var riakObj = rslt.values.shift();
					if (riakObj && riakObj.value) {
						return resolve(riakObj.value.toString("utf8"));
					}
				}
				return resolve(null);
			}
			);
		});
	}
	get(id, bucket, bucketType) {
		var self = this;
		return new Promise((resolve, reject) => {
			self.client.fetchValue({
				bucketType: bucketType,
				bucket: bucket,
				key: id,
				notFoundOk: true
			},
			function (err, rslt) {
				if (err) {
					return reject(err);
				}
				if (rslt.values) {
					var riakObj = rslt.values.shift();
					if (riakObj && riakObj.value) {
						return resolve(riakObj.value.toString("utf8"));
					}
				}
				return resolve(null);
			});
		});
	}
	async update(id, bucket, bucketType, updateValues) {
		var t = new ExecTimer();
		var self = this;
		self.Tick = t.Tick;
		var contactGetTick = new self.Tick("contactGet");
		var contactSaveTick = new self.Tick("contactSave");
		try {
			contactGetTick.start();
			var data = await this.get(id, bucket, bucketType);
			contactGetTick.stop();
			var updatedValue = null;
			if (data) {
				data = JSON.parse(data);
				_.defaults(updateValues, data);
				contactSaveTick.start();
				updatedValue = await this.save(id, bucket, bucketType, updateValues);
				contactSaveTick.stop();
				updatedValue = JSON.parse(updatedValue);
			}
			return {
				previousData: data,
				updatedData: updatedValue,
				contactUpdateTimers : t
			};
		} catch (err) {
			return err;
		}
	}
	delete(key, bucket, bucketType) {
		var self = this;
		return new Promise((resolve, reject) => {
			self.client.deleteValue({
				bucketType: bucketType,
				bucket: bucket,
				key: key
			},
			function (err) {
				if (err) {
					return reject(err);
				}
				return resolve("Deleted");
			});
		});
	}
}

var repository = new Repository();
module.exports = repository;