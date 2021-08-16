var config = {}

config.host = process.env.HOST || "https://frtdb.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "b0uiA6bcpPB9jbe8A0vIVBrPSBYlRZ426ERnsLxvTFymeSBMed2mQ9O0rVbXB4xLMvNADJOY0FWynvYt6i0Zdg==";
config.databaseId = "ToDoList";
config.collectionId = "Items";

module.exports = config;
