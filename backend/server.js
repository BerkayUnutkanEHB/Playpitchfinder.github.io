const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://berkayunutkan:Berkay1012@cluster0.w5szzus.mongodb.net/PlayPitchFinder?retryWrites=true&w=majority"
const client = new MongoClient(url);

// Reference the database to use
const dbName = "PlayPitchFinder";

async function run() {
    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);

        // Reference the "people" collection in the specified database
        const col = db.collection("fields");

        // Create a new document                                                                                                                                           
        let fieldDocument = {

            name: " Spoorweegbaan Kobbegem veld",
            location: {
                latitude: 50.8951779767228,
                longitude: 4.234609875644279
            },
            grass_type: "Natural",
            availability: true,
            facilities: ["Goals"],
            distance: 4.4,
            quality: "bad",
            popularity: 2
        }

        // Insert the document into the specified collection        
        const p = await col.insertOne(fieldDocument);

        // Find and return the document
        const filter = { "name.last": "Turing" };
        const document = await col.findOne(filter);
        console.log("Document found:\n" + JSON.stringify(document));

    } catch (err) {
        console.log(err.stack);
    }

    finally {
        await client.close();
    }
}

app.get('/fields', async (req, res) => {
    try {
        const allFields = await col.find().toArray();
        res.json(allFields);
    } catch (error) {
        console.error('Error fetching heroes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
run().catch(console.dir);