var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function TaskList(taskDao) {
    this.taskDao = taskDao;
}

module.exports = TaskList;

TaskList.prototype = {
    showTasks: function (req, res) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.completed=@completed',
            parameters: [{
                name: '@completed',
                value: false
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }

            res.render('index', {
                title: 'CENG495 HW2',
                tasks: items
            });
        });
    },

    addTask: function (req, res) {
        var self = this;
        var item = req.body;

        self.taskDao.addItem(item, function (err) {
            if (err) {
                throw (err);
            }

            res.redirect('/');
        });
    },

    completeTask: function (req, res) {
        //console.log(req.body);
        var self = this;
        var completedTasks = Object.keys(req.body);

        var index, value, itemId;
        for (index = 0; index < completedTasks.length; ++index) {
            value = completedTasks[index];
            if (req.body[value] === "uButton") {
                itemId = value;
                break;
            }
        }
        var keys = completedTasks;
        if(req.body[value] == "uButton")
        {
            //console.log(itemId);


            async.forEach(completedTasks, function taskIterator(completedTasks, callback){
                self.taskDao.replaceItem(completedTasks, req.body, keys, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }, function goHome(err) {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/');
                }
            });


            // res.redirect('/');

        }
        else
        {

            async.forEach(completedTasks, function taskIterator(completedTask, callback) {
                self.taskDao.updateItem(completedTask, req.body, keys, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }, function goHome(err) {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/');
                }
            });
            /*
            async.forEach(completedTasks, function taskIterator(completedTask, callback) {
                self.taskDao.updateItem(completedTask, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }, function goHome(err) {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/');
                }
            });

            */
        }

    }
};
