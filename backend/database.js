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
					 client.close(callback);
				 });
	   });
	},
	addListing: function(name, list, callback) {
	  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
         insertListing(client, name, list, function (res) {
					 client.close(callback);
				 });
	   });	
	},
	getListings: async function(name) {
		return new Promise (function(resolve, reject) {
	    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
        returnAll(client, name, function (res) {
		 		  client.close();
				  resolve(res);
	 	    });
	    });
	  });
  },
	updateSong: function (colName, id, params, callback) {
	  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
		  updateCollection(client, colName, id, params, function() {
			  client.close(callback);
			});
		});
	},
	deleteTCR: function (colName, callback) {
	  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
		  client.db(dbName).collection(colName).drop().then((res) => {
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
	   callback(res);
	 });
}

function returnAll(client, colName, callback) {
  client.db(dbName).collection(colName).find({}).toArray(function(err, docs) {
	  callback(docs);
	});
}

function updateCollection(client, colName, song_id, params, callback) {
  client.db(dbName).collection(colName).updateOne({id : song_id}, { $set: params }).
		then((res) => {
		  callback();
		});
}
