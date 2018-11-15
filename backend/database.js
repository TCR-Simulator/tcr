const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://softeng18:" + process.env.SOFTENG_MONGODB_PASSWORD + "@musicmap-caf2e.mongodb.net/test?retryWrites=true"
const dbName = "musicmap";
const options = {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "id" ],
      properties: {
         id: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         title: {
            bsonType : "string",
            description: "must be a string"
         },
				 status: {
				   bsonType: "string"
				 },
				 url: {
				   bsonType: "string",
					 description: "must be a string"
				 },
				 listingHash: {
				   bsonType: "string",
					 description: "must be a string"
				 },
				 challengeHash: {
				   bsonType: "string",
					 description: "must be a string"
				 },
      }
   } }
};


module.exports = {
  createRegistry: function(name, callback) {
	   MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
         createCollection(client, name, function (res) {
           console.log(res);
					 client.close(callback);
				 });
	   });
	},
	addListing: function(name, list, callback) {
	  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
         insertListing(client, name, list, function (res) {
           console.log(res);
					 client.close(callback);
				 });
	   });	
	},
	getListings: function(name, callback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
        returnAll(client, name, function (res) {
		 		 client.close(callback);
		 	 });
	  });
	}
};

function createCollection(client, name, callback) {
  client.db(dbName).createCollection(name, options).then((res) => {
	  callback(res);
	});
}

function insertListing(client, colName, listings, callback) {
   client.db(dbName).collection(colName).insertMany(listings).then((res) => {
     console.log(res);
	   callback(res);
	 });
}

function returnAll(client, colName, callback) {
  client.db(dbName).collection(colName).find({}).toArray(function(err, docs) {
	  console.log(docs);
	  callback(docs);
	});
}
