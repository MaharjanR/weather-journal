const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

let projectData = {};

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("client"));

// post route to save data in the projectData
app.post("/weather", async (req, res) => {
    const {
        name,
        feelsLike,
        description,
        minTemp,
        maxTemp,
        temp,
        feeling,
    } = req.body;

    projectData.name = name;
    projectData.feelsLike = feelsLike;
    projectData.description = description;
    projectData.temp = temp;
    projectData.minTemp = minTemp;
    projectData.maxTemp = maxTemp;
    projectData.feeling = feeling;

    res.end();
});

// get route, sends the projectdata object
app.get("/weather", async (req, res) => {
    await res.send(projectData);
});

// setting up port
const port = 3000;

app.listen(port, () => console.log(`Server running in ${port} port`));
