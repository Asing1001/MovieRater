import {MongoClient, Db} from 'mongodb';
import * as assert from "assert";
import * as Q from "q";

export class db {
    static dbUrl: string = 'mongodb://localhost:27017/movierater';//'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater';
    static dbConnection: Db = null;

    public static openDbConnection() {
        var deferred = Q.defer();
        if (this.dbConnection == null) {
            MongoClient.connect(this.dbUrl, (err, db) => {
                assert.equal(null, err);
                console.log("Connected correctly to MongoDB server.");
                this.dbConnection = db;
                deferred.resolve(db);
            });
        }
        return deferred.promise;
    }

    public static closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }

    public static updateDocument(filter: Object, value:Object, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).updateOne(filter, {$set: value}, (err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    public static insertDocument(document: any, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).insertOne(document, (err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    public static insertCollection(collection: any, collectionName: string): any {
        var deferred = Q.defer();
        if (collection && collection.length > 0) {
            this.dbConnection.collection(collectionName).insert(collection, (err, result) => {
                assert.equal(err, null);
                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                }
                deferred.resolve(result);
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    public static getCollectionCount(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).count((err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    }

    public static getCollection(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).find({}).toArray((err, items) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(items);
        });
        return deferred.promise;
    }

    public static getDocument(query: Object, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).findOne(query, (err, document) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(document);
        });
        return deferred.promise;
    }
}