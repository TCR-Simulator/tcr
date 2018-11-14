const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://softeng18:group18!@musicmap-caf2e.mongodb.net/test?retryWrites=true"
MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   } else {
   console.log('Connected...');
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
	 }
})
