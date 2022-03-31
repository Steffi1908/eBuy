const express = require('express');
const path = require('path');
const router = express.Router();    // Funktion => Routen in verschiedenen Dateien und in app.js importieren
const Article = require('../models/Article');
const User = require('../models/User');
const Bid = require('../models/Bid');
const multer = require('multer');

//Bilder hochladen
const storage = multer.diskStorage({               //Dateien speichern
  destination: function(req, file, cb) {          //cb = call back
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);      // Datum und Originalname werden im Uploads-Ordner gespeichert => da Windows keine ":" in Dateinamen erlaubt, wird mit "replace" : durch - ausgetauscht
  }
});

//Filter, welche Art von Bildern hochgeladen werden darf:
const fileFilter = (req, file, cb) => {
  //Dateien akzeptieren oder abweisen:
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);         //Datei wird gespeichert
  } else {
    cb(new Error('Achtung: Bitte nur jpeg- und png-Dateien hochladen!'), false);        // Datei wird abgewiesen und nicht gespeichert
  }

};

// Bilder dürfen nur bis zu 50MByte groß sein
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: fileFilter
});

/* router.get('/', (req, res) => {
    res.send('Du bist auf der Artikel-Seite');
}); 
*/

//GET
//Die Artikel, die angelegt werden, sollen ALLE ausgegeben werden
router.get('/', async (req, res) => {
  try {
    const article = await Article.find();
    article.map;
    res.json(article);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/images/:filepath', async (req, res) => {
  try {
    const options = {
      root: path.join(__dirname)
    };

    console.log("req.params.filepath")
    console.log(req.params.filepath)
    const filepath = path.join(__dirname, '../uploads', req.params.filepath);
    res.sendFile(filepath)
  } catch (err) {
    console.log(err)
    res.json({ message: err });
  }
});

//GET
//EINEN speziellen Artikel zurückgeben
//router.get('/:articleID', async (req, res) => {
//    try{
//    const article = await Article.findById(req.params.articleID);
//    res.json(article);
//    }catch(err){
//        res.json({message: err});
//    }
//});

router.get('/:articleID', async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleID);
    res.json(article);
  } catch (err) {
    res.json({ message: err });
  }
});

/* router.post('/', (req, res) => {
    console.log(req.body);
});
*/

//POST - User kann dem Server etwas mitgeben (z.B. Login-Infos)
//ein neuer artikel muss angelegt werden können
//ein Bild kann hochgeladen werden
//console.log(req.body) => zum Testen - dann wird das, was bei Postman eingegeben wurde, auf der Konsole ausgegeben


// const file = req.files.file;
//     const filename = req.body.newName;
//     const newpath = __dirname + "/public/pic/";

//     file.mv(`${newpath}${filename}`, (err) => {
//         if (err) {
//             res.status(500).json({ loginFlag: true, message: "File upload failed", code: 200 });
//             return;
//         }
//         res.status(200).json({ loginFlag: true, message: "File Uploaded", code: 200 });
//         return;
//     });

router.post('/', async (req, res) => {     //single = man kann nur ein File parsen
  try {
    console.log("req.body")
    console.log(req.body)
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      productImage: req.body.productImage.base64                  //geht durch multer => damit speichern wir die Bildinformation in der DB
    });

    const savedArticle = await article.save();
    res.json(savedArticle);
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err });
  }
});


router.post('/file', async (req, res) => {     //single = man kann nur ein File parsen
  console.log("HELLO FILE")
  console.log(req.body)
  console.log(req.files);

  const file = req.files.file;
  const filename = req.body.newName;
  const newpath = __dirname + "/public/pic/";

  file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
          res.status(500).json({ loginFlag: true, message: "File upload failed", code: 200 });
          return;
      }
      res.status(200).json({ loginFlag: true, message: "File Uploaded", code: 200 });
      return;
  });


  try {
    // const article = new Article({
    //   title: req.body.title,
    //   description: req.body.description,
    //   price: req.body.price,
    //   productImage: req.file.path                   //geht durch multer => damit speichern wir die Bildinformation in der DB
    // });

    // const savedArticle = await article.save();
    res.json("SUCCESS");
  } catch (err) {
    console.log(err)
    res.json({ message: err });

  }
});

//PATCH
//Einen vorhanden Artikel ändern
//Hier wird festgelegt, dass die Artikelbezeichnung verändert werden kann
/*router.patch('/:articleID', async (req, res) => {
    try{
    const modifiedArticle = await Article.updateOne({_id: req.params.articleID}, {$set:{title: req.body.title}});
    res.json(modifiedArticle);
    }catch(err){
        res.json({message: err});
    }
}); */

//Hier wird festgelegt, dass die Artikelbezeichnung verändert werden kann
//artikel muss als "verkauft" gekennzeichnet werden können -> -1 -> Übersetzung Frontend
//artikel kann zum bieten freigeschalten werden -> -1 -> Übersetzung Frontend (Wird User nicht angezeigt)
router.patch('/:articleID', async (req, res) => {
  try {
    const modifiedArticle = await Article.updateOne({ _id: req.params.articleID },
      {
        $set: {
          title: req.body.title, description: req.body.description, price: req.body.price
        }
      });
    res.json(modifiedArticle);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

//DELETE
//Einen vorhanden Artikel löschen
router.delete('/:articleID', async (req, res) => {
  try {
    console.log("req.params")
    console.log(req.params)
    const deletedArticle = await Article.remove({ _id: req.params.articleID });
    res.json(deletedArticle);
  } catch (err) {
    res.json({ message: err });
  }
});

//nach einem oder mehreren artikeln muss gesucht werden können

router.get('/search/:title', async (req, res) => {
  try {
    var regex = new RegExp(req.params.title, 'i');
    await Article.find({ title: regex }).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    res.json({ message: err });
  }
});

// Folgende TO DOS sind noch zu erledigen:

//Man soll sich alle Artikel ausgeben lassen können, auf die geboten werden kann => mit Route für "verfügbare Aritkel" einfach get-request ermöglichen?
router.get('/search/available', async (req, res) => {
  try {
    await Article.find({ available: 1 }).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    res.json({ message: err });
  }
});


//TODO get for bid !!!
router.get('/bid/:idArticle', async (req, res) => {
  try {
    const idArticle = req.params.idArticle;
    console.log(idArticle)
    const bids = await Bid.find({articleID: idArticle}).sort({price: -1})
    res.json(bids);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//alle user können ein gebot auf einen artikel abgeben(, wenn sie eingeloggt sind)
router.post('/bid', async (req, res) => {
  const { articleID, price } = req.body

  //Check, ob das Angebot verfügbar ist 
  const article = await Article.findById(articleID)
  
  //check, ob 15 min vorbei sind 
  const startDate = article.date
  const endDate = new Date(new Date(startDate).getTime() + 1000 * 60 * 15)
  if (endDate < new Date()) {
    console.log("AGEBLAUFEN")
    return res.status(500).send("Error - Das Gebot ist bereits abgelaufen")
  }

  //Check, ob voheriges Gebot und Artikelpreis höher sind
  if (article.price > price) {
    console.log("STARTGEBOT")
    return res.status(500).send("Error - Gebot muss höher sein als Startgebot")
  }

  const bidList = await Bid.find({ articleID: articleID })
  if (bidList && bidList[bidList.length - 1] && bidList[bidList.length - 1].price >= price) {
    console.log("GEBOT MUSS HÖHER SEIN")
    return res.status(500).send("Error - Gebot muss höher sein als aktuelles Gebot")
  }


  const bid = new Bid({
    articleID: articleID,
    userID: 1,
    price: price
  });

  try {
    const savedBid = await bid.save();
    res.json(savedBid);
  } catch (err) {
    res.json({ message: err });

  }
});
//Gebote müssen sich in Echtzeit/ jede Minute aktualisieren -> Im Frontend mit effect setTimeout/SetInterval

//artikel wird nach 15min als verkauft gekennzeichnet -> Schauen was das sinnvollste ist. Im Frontend/Backend realisierbar. timestamp

//Registrieren
//Der User kann sich registrierenVorstellungsrunde

//Login
//Der User kann sich in seinen zuvor erstellten Account einloggen

//Logout
//Der User kann sich aus seinem zuvor erstellten Account ausloggen

module.exports = router;       // Routen können in anderen Dateien importiert werden