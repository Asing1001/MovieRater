"use strict";
var mongodb_1 = require("mongodb");
var Q = require("q");
var systemSetting_1 = require("../configs/systemSetting");
var log_1 = require("../helper/log");
var db = (function () {
    function db() {
    }
    db.openDbConnection = function () {
        var _this = this;
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            if (this.dbConnection == null) {
                mongodb_1.MongoClient.connect(systemSetting_1.systemSetting.dbUrl, function (err, db) {
                    if (err) {
                        console.error(err);
                        deferred.reject(err);
                    }
                    console.log("Connected correctly to MongoDB server.");
                    _this.dbConnection = db;
                    deferred.resolve(db);
                });
            }
            else {
                deferred.resolve(this.dbConnection);
            }
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    db.closeDbConnection = function () {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    };
    db.updateDocument = function (filter, value, collectionName, options) {
        if (options === void 0) { options = { upsert: true }; }
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).updateOne(filter, { $set: value }, options, function (err, result) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    db.insertDocument = function (document, collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).insertOne(document, function (err, result) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    db.insertCollection = function (collection, collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            if (collection && collection.length > 0) {
                this.dbConnection.collection(collectionName).insert(collection, function (err, result) {
                    if (err) {
                        console.error(err);
                        deferred.reject(err);
                    }
                    deferred.resolve(result);
                });
            }
            else {
                deferred.resolve();
            }
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    db.getCollectionCount = function (collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).count(function (err, result) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    db.getCollection = function (collectionName, sort) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).find({}).sort(sort).toArray(function (err, items) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(items);
            });
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    db.getDocument = function (query, collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).findOne(query, function (err, document) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(document);
            });
        }
        catch (error) {
            console.error(error);
        }
        return deferred.promise;
    };
    return db;
}());
db.dbConnection = null;
exports.db = db;
//# sourceMappingURL=db.js.map