import {MongoClient, Db} from 'mongodb';
import * as assert from "assert";
import * as Q from "q";

export interface Movie {
    yahooId: number,
    chineseTitle: string,
    englishTitle: string,
    releaseDate: Date,
    type: string,
    runTime: string,
    director: string,
    actor: string,
    launchCompany: string,
    companyUrl: string,
    sourceUrl: string
}

// Create a class to manage the data manipulation.
export class DataAccess {
    static dbUrl: string = 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater';
    dbConnection: Db = null;

    // Open the MongoDB connection.
    public openDbConnection() {
        if (this.dbConnection == null) {
            MongoClient.connect(DataAccess.dbUrl, (err, db) => {
                assert.equal(null, err);
                console.log("Connected correctly to MongoDB server.");
                this.dbConnection = db;
            });
        }
    }

    // Close the existing connection.
    public closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }

    public getMoviesCount(): any {
        return this.getDocumentCount('Movies');
    }

    public getMovies(): Q.Promise<Movie[]> {
        return this.getCollection('Movies');
    }

    public insertMovies(movie: any): any {
        return this.insertDocuments(movie, 'Movies');
    }    

    // Insert a new document in the collection.
    private insertDocument(document: any, collectionName: string): any {
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

    // Insert a new document in the collection.
    private insertDocuments(document: any, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).insert(document, (err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    // Get the count of all documents in the collection.
    private getDocumentCount(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection && this.dbConnection.collection(collectionName).count((err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    }

    private getCollection(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection && this.dbConnection.collection(collectionName).find({}).toArray((err, items) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(items);
        });
        return deferred.promise;
    }
}