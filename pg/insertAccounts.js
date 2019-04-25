const pg = require('pg');
const Account = require('./Account.js');
const accountPayload = require('./accountsData.js');
const accountTransform = require('./accountTransform.js');
const config = require('./config.js');
const ExecTimer = require('./execTimer.js');

async function accountInsert (accountItemPayload, pool) {
  let client;
  var self      = this;
  var t         = new ExecTimer();
  self.Tick = t.Tick;

  var mainTick = new self.Tick("TotalTick");
  var connectTick = new self.Tick("ConnectDBTick");
  var transformTick = new self.Tick("TransformTick");
  var queryTick = new self.Tick("QueryTick");

  let payload = {};
  mainTick.start();

  try {
    connectTick.start();

    client = await pool.connect();

    connectTick.stop();
  } catch (e) {
    console.error('Unable to Connect', e);
  }

  transformTick.start();

  let accountItemRaw = [].concat(accountItemPayload);
  console.log('Payload:-', accountItemRaw);
  let accountItem = accountItemRaw.map((item)=>{
    return accountTransform(item);
  });
  let query = Account.insert(accountItem).returning(Account.external_id).toQuery();

  transformTick.stop();

  try {
    queryTick.start();

    let {rows} = await client.query(query);
    payload.reponse = (rows.length) ? rows[0] : null;

    queryTick.stop();
  } catch (e) {
    console.error(e);
    payload.error = e;
  } finally {
    mainTick.stop();

    payload.timers = timerReport(t.timers);
    client.release();
    return payload;
  }
}

function timerReport (timerArray) {
  let result = Object.keys(timerArray).map(function(key){
    return {
      name    : key,
      count   : timerArray[key].count(),
      duration: timerArray[key].parse(timerArray[key].duration())
    };
  });
  return result;
}

module.exports = accountInsert;