const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const {ExpressPeerServer} = require('peer');
const multer = require('multer');
let crypto = require('crypto');

// Prevent NoSQL injection
const sanitize = require('mongo-sanitize');

// Ensure that the app always uses HTTPS even if the user manually types in HTTPS
let sslRedirect = require('heroku-ssl-redirect').default;
app.use(sslRedirect());

app.use(session({
    secret: 'PICSHARE SECRET',
    proxy : true,
    resave: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    },
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

// Heroku does temp uploads so using Mongo DB to store this data
const MongoClient = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;
const ObjectID = require('mongodb').ObjectID;

let connectionString = 'mongodb+srv://Picshare-Main:A1JmCLfS3lrEAw2A@cluster0.qidcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const GridFsStorage = require('multer-gridfs-storage');

// credits: Tom Settle
// https://www.settletom.com/blog/uploading-images-to-mongodb-with-multer
const storage = new GridFsStorage({
    url: connectionString,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = file.originalname
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                }
                resolve(fileInfo)
            })
        })
    },
})

const upload = multer({storage});
let gfs

MongoClient.connect(connectionString, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db('picshare-db')

    const users = db.collection('userinfo')
    const images = db.collection('images')

    gfs = new GridFSBucket(client.db(), {
        bucketName: 'uploads'
    });


    app.post('/signup/', function (req, res, next) {
        let username = sanitize(req.body.username);
        let password = sanitize(req.body.password);
        let name = sanitize(req.body.name);

        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        password = hash.digest('base64');

        users.findOne({_id: username}, function (err, user) {
            if (err) return res.status(500).end(err);
            if (user) return res.status(409).end("username " + username + " already exists");
            users.update({_id: username}, {_id: username, password, salt, name}, {upsert: true}, function (err) {
                if (err) return res.status(500).end(err);
                req.session.username = username;
                return res.json("user " + username + " signed up");
            });
        });
    });

    app.post('/signin/', function (req, res, next) {
        let username = sanitize(req.body.username);
        let password = sanitize(req.body.password);

        // retrieve user from the database
        users.findOne({_id: username}, function (err, user) {
            if (err) return res.status(500).end(err);
            if (!user) return res.status(401).end("username Does not exists");

            var hash = crypto.createHmac('sha512', user.salt);
            hash.update(password);
            password = hash.digest('base64');

            if (user.password !== password) return res.status(401).end("Incorrect password");
            req.session.username = username;
            return res.json("user " + username + " signed in");
        });
    });

    app.get('/signout/', function (req, res, next) {
        req.session.destroy();
        return res.json("User Signed Out").status(200);
    });


    app.post('/api/images/', upload.single('picture'), function (req, res, next) {
        if (!req.session.username) {
            return res.status(401).send()
        }

        if (err) console.log(err)
        images.update({_id: req.file.id}, {username: req.session.username}, {upsert: true}, function (err) {
            if (err) return res.status(500).end(err);
            res.json(req.file.id).status(201).send()
        });
    });

    app.post('/api/images/:id', upload.single('picture'), function (req, res, next) {

        if (err) console.log(err)
        if (!req.session.username) {
            return res.status(401).send()
        }

        let idObject = ObjectID(sanitize(req.params.id));

        gfs.delete((idObject), function (err) {
            if (err) {
                console.log(err)
            }

            images.deleteOne({_id: idObject}, function (err) {
                images.update({_id: req.file.id}, {username: req.session.username}, {upsert: true}, function (err) {
                    if (err) return res.status(500).end(err);
                    res.json(req.file.id).status(201).send()
                });
            })
        })
    });

    app.get("/image/:filename", (req, res) => {
        gfs
            .find({
                _id: ObjectID(sanitize(req.params.filename))
            })
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    console.log("No files exist")
                    return res.status(404).json({
                        err: "no files exist"
                    });
                }
                gfs.openDownloadStream(ObjectID(sanitize(req.params.filename))).pipe(res);
            });
    });

    app.get("/images/", (req, res) => {

      if (!req.session.username) {
          return res.status(401).send()
      }

        images.find({username: req.session.username}).toArray(function (err, data) {
            data.reverse()
            return res.json(data).status(200)
        });
    });

    app.get("/username", (req, res) => {
        if (req.session.username) {
            return res.json(req.session.username).status(200);
        } else {
            return  res.json("").status(200)
        }
    })

    app.delete("/images/:id", (req, res) => {
            if (!req.session.username) {
                return res.status(401).status("Please sign in first")
            }

            images.findOne({_id: ObjectID(req.params.id)}, function (err, image) {
                if (image.username !== req.session.username) {
                    return res.status(401).status("You are not the owner of this image")
                }
            })

            gfs.delete(ObjectID(req.params.id), function (err) {
                if (err) {
                    return res.status(401).send()

                } else {
                    images.deleteOne({_id: ObjectID(req.params.id)}, function (err) {
                        return res.json({}).status(200).send()
                    })
                }
            })
        }
    )
})

// Logic to send a basic server
app.use(express.static(path.join(__dirname, '../build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const http = require('http');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer)

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
