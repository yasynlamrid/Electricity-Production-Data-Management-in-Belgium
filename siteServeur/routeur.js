var express = require("express"); // permet de récupérer le module express
var routeur = express.Router();
const mongoose = require('mongoose');
const fuelDataModel = require("./models/fuelData");


routeur.get("/", (requete, reponse) => {
    reponse.render("accueil.ejs");
}); // la fonction se déclenche une fois qu'on choisit la route

routeur.get("/donnees", async (requete, reponse) => {
    let page = parseInt(requete.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const fuelData = await fuelDataModel.find()
            .sort({ day: -1, hours: 1 }) // Tri par jour puis par heure
            .skip(skip)
            .limit(limit);

        const count = await fuelDataModel.countDocuments();

        reponse.render("energie.ejs", {
            fuelData, 
            currentPage: page, 
            totalPages: Math.ceil(count / limit),
            hasNextPage: page * limit < count,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error(error);
        reponse.status(500).send("Erreur lors de la récupération des données");
    }
});





routeur.post("/donnees", async (requete, reponse) => {

const energy = new  fuelDataModel({
    _id: new mongoose.Types.ObjectId(),
    day: requete.body.journame,
    hours: requete.body.Heurename,
    dayAheadGenerationSchedule_CP : requete.body.Charbonname,
    dayAheadGenerationSchedule_LF :requete.body.Fioulname,
    dayAheadGenerationSchedule_NG: requete.body.Gazname,
    dayAheadGenerationSchedule_NU : requete.body.Nuclearname,
    dayAheadGenerationSchedule_Other : requete.body.Othername,
    dayAheadGenerationSchedule_WA : requete.body.Eoliennename,
    dayAheadGenerationSchedule_WI :requete.body.Hydroname

})   
energy.save() // permet d'enregistrer les données inserées dans mongoDB
.then(resultat =>{

    console.log(resultat);
    reponse.redirect("/donnees")

})
.catch(error => {
    console.log(error);
})
    
}); 

// Modification d'une donnée 
routeur.get("/donnees/modification/:id", (requete, reponse) => {
    fuelDataModel.findById(requete.params.id)
    .then(fuelData => {
        if (!fuelData) {
            return reponse.status(404).send("Donnée non trouvée");
        }
        reponse.render("modifier.ejs", { fuelData: fuelData });
    })
    .catch(error => {
        console.error(error);
        reponse.status(500).send("Erreur lors de la récupération des données pour modification");
    });
});


// Mise à jour des données soumises
routeur.post("/donnees/modification/:id", (requete, reponse) => {
    const id = requete.params.id;
    const updatedData = {
        day: requete.body.journame,
        hours: requete.body.Heurename,
        dayAheadGenerationSchedule_CP: requete.body.Charbonname,
        dayAheadGenerationSchedule_LF: requete.body.Fioulname,
        dayAheadGenerationSchedule_NG: requete.body.Gazname,
        dayAheadGenerationSchedule_NU: requete.body.Nuclearname,
        dayAheadGenerationSchedule_Other: requete.body.Othername,
        dayAheadGenerationSchedule_WA: requete.body.Eoliennename,
        dayAheadGenerationSchedule_WI: requete.body.Hydroname
    };

    fuelDataModel.findByIdAndUpdate(id, updatedData)
    .then(result => {
        reponse.redirect("/donnees");
    })
    .catch(error => {
        console.error(error);
        reponse.status(500).send("Erreur lors de la mise à jour des données");
    });
});




routeur.post("/donnees/delete/:id", (requete, reponse)=> {


    fuelDataModel.findByIdAndDelete(requete.params.id)
    .exec()
    .then(resultat =>{
        reponse.redirect("/donnees")
    })
    .catch(error => {

        console.log(error)

    })

})
routeur.use((requete, reponse, suite) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    suite(error);
});

routeur.use((error, requete, reponse, suite) => {
    reponse.status(error.status || 500);
    reponse.end(error.message);
});

module.exports = routeur;
