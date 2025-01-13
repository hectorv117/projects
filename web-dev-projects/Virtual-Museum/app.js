const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
var FetchStream = require("fetch").FetchStream;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//main api endpoint
const url = "https://collectionapi.metmuseum.org/public/collection/v1/";
//will be added to the main endpoint when making GET request for a specific artowrk id
let objs  = "objects/";

//this global array will be used to store artwork objects created by parsing the json response of the artwork id request
//the array will then be passed on to the ejs template file 'search.ejs' which will be used to display the info of each artwork
let currentArtworks = [];
//this empty array will be passed to search.ejs when a get request to server has been made since a search query hasn't been made yet
let emptiness = [];
//this value is passed to the search.ejs file to confirm wether the users search query resulted in an error
// the file will display an error prompt based on this value
let error = false;
//used to store the users search query
let query = "";


// async function that recieves an artworks id number and appends it to a GET request to recieve information about that specific artwork
async function getArtwork(id) {

  let json = "";
// json object created to store relevant information about the artwork
  const artwork = {
    link: String,
    title: String,
    artist: String,
    date: String

  };


  let promise = new Promise((resolve, reject) => {
    var fetch = new FetchStream(url +objs +id);

    fetch.on("data", function(chunk) {
      json = JSON.parse(chunk);
      artwork.link = json.primaryImageSmall;
      artwork.title = json.title;
      //some artworks don't have an artist or end date
      if (json.artistDisplayName === '') {
        artwork.artist = 'unknown';
      } else {
        artwork.artist = json.artistDisplayName
      }

      if(json.objectEndDate === 0){
        artwork.date = "unknown"
      }else{
      artwork.date = json.objectEndDate;
    }
      resolve(artwork)


    });
  })

  let artworkInfo = promise;
//return new artwork object
  return artworkInfo;

};

//async function that takes an array of different artwork ids and populates the currentArtworks array with new artwork objects by making GET requests for each id
async function arrayOfArtworks(ids) {
// the site will only display a max of 12 artworks
  for (i = 0; i < 12 && i < ids.length; i++) {
    currentArtworks[i] = await getArtwork(ids[i]);
    Promise.resolve(currentArtworks[i]).then((res) => {})
  }
}



app.get("/", function(req, res) {
  res.render("search", {
    //arr is empty since nothing will be displayed
    arr: emptiness, error: error, query: query
  });
})






app.post("/", function(req, res) {
  //this array will store the artwork ids that result from the users search
  let arrayOfArtworkIds = [];
  query = req.body.searchbar;
  // this will be used to make a GET request that appends the users entered search query
  let userSearchQuery = url + "search?hasImages=true&q=" + query;

  https.get(userSearchQuery, function(response) {
    let status = response.statusCode;
    console.log(status);
    // kept getting unexpected end of json error so I stored all of it into an array which was concatanated and parsed when the response was finished
    let chunks = [];

    response.on("data", function(data) {
      chunks.push(data);
    }).on("end", function() {
      let jData = Buffer.concat(chunks);
      let schema = JSON.parse(jData);
      // objectID's is typically a very large array of multiple resulting artwork ids
      let totalIds = schema.objectIDs;

      //total ids is null when the request using the users search query was unsuccessful set error to true and render search.ejs
      if (totalIds === null) {
         error = true;
        res.render("search", {arr: emptiness, error:error, query: query})
      } else {
        //if totalIds wasn't null/empty create a smaller array of max 12 unique artwork ids by passing totalIds to the uniqueIds function
        arrayOfArtworkIds = uniqueIds(totalIds);

        //pass the 12 or less ids into arrayOfArtworks to be created into new artwork objects and populated into the currentArtworks array
        //since arrayOfArtworks returns a promise store it as variable to be resolved
        let fotos = arrayOfArtworks(arrayOfArtworkIds);
        Promise.resolve(fotos).then((result) => {
          //once fotos has been resolved a.k.a all of the GET requests for each id has been comlpeted and each id has been created into a new artwork object and stored in the array
          // render the search.ejs file and pass on the completed array of new artwork objects
          error = false;
          res.render("search", {

            arr: currentArtworks, error: error, query: query
          });
        });

      }

    })


  });

});




//this function takes in an array of artwork ids and randomly returns one id
function generateID(array) {

  let randomIndex = Math.random() * array.length;
  let objId = array[Math.floor(randomIndex)];


  return objId;
}



//this function takes in an array of artwork ids and returns an array of 12 or less unique ids
function uniqueIds(array) {

  let list = [];

  for (i = 0; i < 12 && i < array.length; i++) {
    list[i] = generateID(array);
    for (j = 0; j <= i; j++) {
      if (list[j] === list[i] && i !== j) {
        i--;
      }
    }
  }

  return list;

}


app.listen(3000, function() {
  console.log("Server is running in FULL effect");
});
