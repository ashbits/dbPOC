const Contact = require('./Contact.js');
const contactTransform = require('./contactTransform.js');
const ExecTimer = require('./execTimer.js');

async function contactInsert (contactItemPayload, pool) {
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
  let contactItemRaw = [].concat(contactItemPayload);
  console.log('Payload:-', contactItemRaw);
  let contactItem = contactItemRaw.map((item)=>{
    return contactTransform(item);
  });

  let query = Contact.insert(contactItem).returning(Contact.external_contact_id).toQuery();

  transformTick.stop();

  try {
    queryTick.start();

    let {rows} = await client.query(query);
    payload.reponse = (rows.length) ? rows : null;

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

module.exports = contactInsert;