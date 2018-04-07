"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Q = require("q");
const systemSetting_1 = require("../configs/systemSetting");
const log_1 = require("../helper/log");
class db {
    static openDbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.dbConnection) {
                    this.dbConnection = yield mongodb_1.MongoClient.connect(systemSetting_1.systemSetting.dbUrl);
                    console.log('connect to mongodb correctly');
                }
            }
            catch (error) {
                console.error(error);
            }
            return this.dbConnection;
        });
    }
    static closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }
    static updateDocument(filter, value, collectionName, options = { upsert: true }) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).updateOne(filter, { $set: value }, options, (err, result) => {
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
    }
    static insertDocument(document, collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).insertOne(document, (err, result) => {
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
    }
    static insertCollection(collection, collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            if (collection && collection.length > 0) {
                this.dbConnection.collection(collectionName).insert(collection, (err, result) => {
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
    }
    static getCollectionCount(collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).count((err, result) => {
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
    }
    static getCollection({ name, sort = {}, fields = {} }) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(name).find({}, fields).sort(sort).toArray((err, items) => {
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
    }
    static getDocument(query, collectionName) {
        var deferred = Q.defer();
        try {
            log_1.default.debug(arguments);
            this.dbConnection.collection(collectionName).findOne(query, (err, document) => {
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
    }
}
db.dbConnection = null;
exports.db = db;
//# sourceMappingURL=db.js.map