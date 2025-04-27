const mongoose = require('mongoose');

const fuelDataSchema =  mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    day: String,
    hours: String,
    dayAheadGenerationSchedule_CP : Number,
    dayAheadGenerationSchedule_LF :Number,
    dayAheadGenerationSchedule_NG: Number,
    dayAheadGenerationSchedule_NU : Number,
    dayAheadGenerationSchedule_Other : Number,
    dayAheadGenerationSchedule_WA : Number,
    dayAheadGenerationSchedule_WI :Number

  });

module.exports = mongoose.model("fuelData",fuelDataSchema); // cette ligne permet d'associer le modele avec le shema qu'on a crée