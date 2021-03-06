var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure');
var mongoskin = require('mongoskin');
//var Timestamp = mongoskin.BSONPure.Timestamp;

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var tableName = "RunbookUserTable"
var storageName = "https://runbookbot.documents.azure.com:443/"; 
var storageKey = "kLn1qWqSPVlp9cpwEVJF9J0UKVymuWuyVzLrMIrSIjok0A61RmO04Ct4a8BpZfG25X1CLRY7y5Z0KXNginTnQQ=="; 

var documentDbOptions = {
    host: 'https://runbookbot.documents.azure.com:443/', 
    masterKey: 'kLn1qWqSPVlp9cpwEVJF9J0UKVymuWuyVzLrMIrSIjok0A61RmO04Ct4a8BpZfG25X1CLRY7y5Z0KXNginTnQQ==', 
    database: 'runbooksdata',   
    collection: 'runbookscollection',

};

var docDbClient = new azure.DocumentDbClient(documentDbOptions);


var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);

var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({

    appId: '3baa0251-6887-4404-b3d4-8d2da3f2e9a7',
    appPassword: 'mgezyROEP9113!:faADR5[+'
   
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.userData = {"userId": session.message.user.id, "jobTitle": "Senior Developer"};

    // capture conversation information  
    //
    session.conversationData[Date()] = session.message.text;

    session.send("You said: %s", session.message.text);
    session.save();
}).set('storage', cosmosStorage);