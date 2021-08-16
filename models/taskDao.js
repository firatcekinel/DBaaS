var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

function TaskDao(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseId = databaseId;
    this.collectionId = collectionId;

    this.database = null;
    this.collection = null;
}

module.exports = TaskDao;

TaskDao.prototype = {
    init: function (callback) {
        var self = this;

        docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);
            } else {
                self.database = db;
                docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                    if (err) {
                        callback(err);

                    } else {
                        self.collection = coll;
                    }
                });
            }
        });
    },

    find: function (querySpec, callback) {
        var self = this;

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results);
            }
        });
    },

    addItem: function (item, callback) {
        var self = this;

        item.completed = false;

        self.client.createDocument(self.collection._self, item, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                callback(null, doc);
            }
        });
    },

    updateItem: function (itemId, req, completedTasks, callback) {
        var self = this;

        if (req[itemId] == "dButton")
        {
            self.getItem(itemId, function (err, doc) {
                if (err) {
                    callback(err);

                } else {
                    doc.completed = true;

                    //self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                    self.client.deleteDocument(doc._self, doc, function (err, replaced) {
                        if (err) {
                            callback(err);

                        } else {
                            callback(null, replaced);
                        }
                    });
                }
            });
        }
        else{
            callback(null);
        }

    },

    replaceItem: function (itemId, req, completedTasks, callback) {
        var self = this;
        if (req[itemId] == "uButton")
        {
            self.getItem(itemId, function (err, doc) {
                if (err) {
                    callback(err);

                } else {
                    for(var i=0; i<completedTasks.length-1; i++)
                    {
                        var val = completedTasks[i];

                        doc[val] = req[val];
                    }

                    self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                        if (err) {
                            callback(err);

                        } else {
                            callback(null, replaced);
                        }
                    });
                }
            });
        }
        else
        {
            callback(null);
        }

    },

    getItem: function (itemId, callback) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results[0]);
            }
        });
    }

};
