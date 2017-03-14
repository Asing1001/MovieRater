import { MongoClient, Db, ReplaceOneOptions } from 'mongodb';
import * as Q from "q";
import { systemSetting } from '../configs/systemSetting';
import log from '../helper/log';

export class db {
    static dbConnection: Db = null;

    public static openDbConnection() {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            if (this.dbConnection == null) {
                MongoClient.connect(systemSetting.dbUrl, (err, db) => {
                    if (err) {
                        console.error(err);
                        deferred.reject(err);
                    }
                    console.log("Connected correctly to MongoDB server.");
                    this.dbConnection = db;
                    deferred.resolve(db);
                });
            } else {
                deferred.resolve(this.dbConnection);
            }
        } catch (error) {
            console.error(error);
            deferred.reject(error);
        }
        return deferred.promise;
    }

    public static closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }

    public static updateDocument(filter: Object, value: Object, collectionName: string, options: ReplaceOneOptions = { upsert: true }): any {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            this.dbConnection.collection(collectionName).updateOne(filter, { $set: value }, options, (err, result) => {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        } catch (error) {
            console.error(error);
        }
        return deferred.promise;
    }

    public static insertDocument(document: any, collectionName: string): any {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            this.dbConnection.collection(collectionName).insertOne(document, (err, result) => {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        } catch (error) {
            console.error(error);
        }
        return deferred.promise;
    }

    public static insertCollection(collection: any, collectionName: string): any {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            if (collection && collection.length > 0) {
                this.dbConnection.collection(collectionName).insert(collection, (err, result) => {
                    if (err) {
                        console.error(err);
                        deferred.reject(err);
                    }
                    deferred.resolve(result);
                });
            } else {
                deferred.resolve();
            }
        } catch (error) {
            console.error(error);
        }
        return deferred.promise;
    }

    public static getCollectionCount(collectionName: string): any {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            this.dbConnection.collection(collectionName).count((err, result) => {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        } catch (error) {
            console.error(error);
        }
        return deferred.promise;
    }

    public static getCollection(collectionName: string, sort?: Object): any {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            this.dbConnection.collection(collectionName).find({}).sort(sort).toArray((err, items) => {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(items);
            });
        } catch (error) {
            console.error(error);
        }
        return deferred.promise;
    }

    public static getDocument(query: Object, collectionName: string): any {
        var deferred = Q.defer();
        try {
            log.debug(arguments);
            this.dbConnection.collection(collectionName).findOne(query, (err, document) => {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(document);
            });
        } catch (error) {
            console.error(error);
        }
        return deferred.promise;
    }
}