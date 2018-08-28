var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure')
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var documentDbOptions = {
    host: 'https://runbookbot.documents.azure.com:443/', 
    masterKey: 'kLn1qWqSPVlp9cpwEVJF9J0UKVymuWuyVzLrMIrSIjok0A61RmO04Ct4a8BpZfG25X1CLRY7y5Z0KXNginTnQQ==', 
    database: 'runbooksdata',   
    collection: 'runbookscollection'
};

var docDbClient = new azure.DocumentDbClient(documentDbOptions);

var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({

    appId: '3baa0251-6887-4404-b3d4-8d2da3f2e9a7',
    appPassword: 'mgezyROEP9113!:faADR5[+'
   
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
}).set('storage', cosmosStorage);