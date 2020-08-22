
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

const directoryPath = path.join(__dirname, '../../public/img/ivan');

const keys = require('../dev-custom-apis-f076558a393b.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

async function getTheData(auth) {
  const gsapi = google.sheets({ version: 'v4', auth });

  const opt = {
    spreadsheetId: '1LIgzdaXP1w6yUSfRGftHXb2FdICZhB2WCVn4NB6mjAM',
    range: 'A4:B104',
  }
  const res = await gsapi.spreadsheets.values.get(opt);

  return res;
}

function handlerGenerateList(req, res) {

  const { __amp_source_origin } = req.query;

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    SCOPES,
  )
  
  const regex = / /gi;
  client.authorize(async function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    } else {
     
      const data = await getTheData(client);
      const result = data.data.values;
      const newResult = await Promise.all(result.map(async (r) => {
        const files = await readdir(directoryPath+'/'+r[0]);        
        r.push('/img/ivan/'+r[0]+'/'+files[0].replace(regex, '%20'));        
        return r;
      }));
      
      res.status(200).json(newResult);
    }
  });
}

module.exports = {
  handlerGenerateList
}