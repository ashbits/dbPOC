var Riak = require("basho-riak-client");
var _ = require("lodash");
var nodes = process.env.RIAK_NODES;
var nodeArray = nodes.split(",");
var  repository = require("./repository");
var dedupConfig = require("./dedupConfig.json");

class Dedup {
	constructor() {
		this.client = new Riak.Client(nodeArray);
	}
	async createDedupeFields(data) {
		var keys = Object.keys(dedupConfig);
		var length = keys.length;
		for (let i = 0; i < length; i++) {
			let bucket = dedupConfig[keys[i]].bucket;
			let bucketType = dedupConfig[keys[i]].bucketType;
			if (data[keys[i]]) {
				await repository.save(data[keys[i]], bucket, bucketType, true);
			}
		}
	}

	async deleteDedupeFields(data) {
		var keys = Object.keys(dedupConfig);
		var length = keys.length;
		for (let i = 0; i < length; i++) {
			let bucket = dedupConfig[keys[i]].bucket;
			let bucketType = dedupConfig[keys[i]].bucketType;
			if (data[keys[i]]) {
				await repository.delete(data[keys[i]], bucket, bucketType);
			}
		}
	}

	async updateDedupeFields(previousData, currentData) {
		var keys = Object.keys(dedupConfig);
		var length = keys.length;
		for (let i = 0; i < length; i++) {
			let bucket = dedupConfig[keys[i]].bucket;
			let bucketType = dedupConfig[keys[i]].bucketType;
			if (previousData[keys[i]]) {
				await repository.delete(previousData[keys[i]], bucket, bucketType);
			}
			if (currentData[keys[i]]) {
				await repository.save(currentData[keys[i]], bucket, bucketType, true);
			}
		}
	}

	async checkDedupeFields(data) {
		var isDedup = false;
		var keys = Object.keys(dedupConfig);
		var length = keys.length;
		for (let i = 0; i < length; i++) {
			let bucket = dedupConfig[keys[i]].bucket;
			let bucketType = dedupConfig[keys[i]].bucketType;
			if (data[keys[i]]) {
				isDedup = await repository.get(data[keys[i]], bucket, bucketType);
			}
			if(isDedup) {
				return {
					isDedup : isDedup,
					type : keys[i]
				};
			}
		}
		return {
			isDedup : false
		};
	}
}

var dedup = new Dedup();
module.exports = dedup;