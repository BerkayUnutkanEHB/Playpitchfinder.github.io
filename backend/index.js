const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb')
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const registeredUsers = [];
require('dotenv').config()

//Create mongoclient
const client = new MongoClient(process.env.FINAL_URL)

const port = process.env.port || 1337;

app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json())

app.get("/testMongo", async (req, res) => {
    try {
        await client.connect();

        const colli = client.db('PlayPitchFinder').collection('users');
        const users = await colli.find({}).toArray();

        res.status(200).send(users);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }

})

app.post("/register", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(401).send({
            status: "Bad Request",
            message: "Some field are missing: username, email, password"
        });
        return;
    }

    try {
        await client.connect();

        const colli = client.db('PlayPitchFinder').collection('users');

        // Controleer of de gebruikersnaam al in gebruik is
        const existingUsername = await colli.findOne({ username: req.body.username });

        if (existingUsername) {
            res.status(400).send({
                status: "Bad Request",
                message: "Deze gebruikersnaam is al in gebruik. Kies een andere."
            });
            return;
        }

        // Controleer of het e-mailadres al in gebruik is
        const existingEmail = await colli.findOne({ email: req.body.email });

        if (existingEmail) {
            res.status(400).send({
                status: "Bad Request",
                message: "Dit e-mailadres is al in gebruik. Kies een ander e-mailadres."
            });
            return;
        }

        // gebruikersnaam is uniek
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            uuid: uuidv4()
        };

        const insertedUser = await colli.insertOne(user);

        res.status(201).send({
            status: "Saved",
            message: "Gebruiker is opgeslagen!",
            data: insertedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Er is iets misgegaan',
            value: error
        });
    } finally {
        await client.close();
    }
});


app.post("/login", async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(401).send({
            status: "Bad Request",
            message: "Some field are missing : email, password"
        })
        return
    }
    try {
        await client.connect();

        const loginuser = {
            email: req.body.email,
            password: req.body.password,
        }
        const colli = client.db('PlayPitchFinder').collection('users');

        const query = { email: loginuser.email }
        const user = await colli.findOne(query)

        if (user) {
            if (user.password == loginuser.password) {
                res.status(200).send({
                    status: "Authentification succesful",
                    message: "You are logged in!",
                    data: {
                        username: user.username,
                        email: user.email,
                        uuid: user.uuid,
                    }
                })
            } else {
                res.status(401).send({
                    status: "Authentification error",
                    message: "Password is incorrect"
                })
            }
        } else {
            res.status(401).send({
                status: "Authentification error",
                message: "No user with this email has been found! make sure you register first!"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }

})

app.post("/verifyID", async (req, res) => {

    if (!req.body.uuid) {
        res.status(401).send({
            status: "Bad Request",
            message: "ID is missing"
        })
        return
    } else {
        if (!uuidValidate(req.body.uuid)) {
            res.status(401).send({
                status: "Bad Request",
                message: "ID is not a valid UUID"
            })
            return
        }
    }

    try {
        await client.connect();
        const colli = client.db('PlayPitchFinder').collection('users');

        const query = { uuid: req.body.uuid }
        const user = await colli.findOne(query)

        if (user) {
            res.status(200).send({
                status: "Verified",
                message: "Your UUID is valid!",
                data: {
                    username: user.username,
                    email: user.email,
                    uuid: user.uuid,
                }
            })
        } else {
            res.status(401).send({
                status: "Verify error",
                message: `no user exist with uuid ${req.body.uuid}`
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
})


function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    } else {
        res.status(401).send({
            status: "Unauthorized",
            message: "Je moet ingelogd zijn om feedback in te dienen."
        });
    }
}

app.post('/feedback', async (req, res) => {
    try {
        await client.connect();

        const feedbackData = req.body;

        const colli = client.db('PlayPitchFinder').collection('feedback');
        const insertedFeedback = await colli.insertOne(feedbackData);

        res.status(201).json(insertedFeedback.ops[0]);
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/feedback', async (req, res) => {
    try {
        await client.connect();

        const colli = client.db('PlayPitchFinder').collection('feedback');
        const allFeedback = await colli.find().toArray();

        res.json(allFeedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/feedback/:id', async (req, res) => {
    try {
        await client.connect();

        const colli = client.db('PlayPitchFinder').collection('feedback');
        const feedback = await colli.findOne({ _id: ObjectId(req.params.id) });

        if (!feedback) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }

        res.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.put('/feedback/:id', async (req, res) => {
    try {
        await client.connect();

        const colli = client.db('PlayPitchFinder').collection('feedback');
        const updatedFeedback = await colli.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: 'after' }
        );

        if (!updatedFeedback.value) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }

        res.json(updatedFeedback.value);
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.delete('/feedback/:feedbackId', async (req, res) => {
    try {
        await client.connect();
        const colli = client.db('PlayPitchFinder').collection('feedback');
        // Zoek en verwijder het feedbackdocument op basis van het opgegeven feedbackId
        const deletedFeedback = await colli.findOneAndDelete({ feedbackId: req.params.feedbackId });

        if (!deletedFeedback.value) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }
        // Stuur een reactie als de feedback met succes is verwijderd
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/fields', async (req, res) => {
    try {
        await client.connect();
        const colli = client.db('PlayPitchFinder').collection('fields');

        const allFields = await colli.find().toArray();
        res.json(allFields);
    } catch (error) {
        console.error('Error fetching fields:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.listen(3000);
console.log("app running at http://localhost:3000");