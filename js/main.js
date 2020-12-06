//app is for general control over the application
//and connections between the other components
const log = console.log;

const APP = {
   KEY: "67a8835b5b606f17a40522e9ff643ea8",
   baseURL: 'https://api.themoviedb.org/3/',
   get urlConfig() {
      return `${this.baseURL}configuration?api_key=${this.KEY}`
   },
   IMG_BASE_URL: 'https://image.tmdb.org/t/p/',

   init: () => {
      //this function runs when the page loads
      // input.addEventListener('input', SEARCH);
      let searchBtn = document.querySelector('#btnSearch');
      searchBtn.addEventListener('click', SEARCH.search);
   },
};

//search is for anything to do with the fetch api
const SEARCH = {
   search(ev) {
      ev.preventDefault()
      let input = document.querySelector('input');
      let url = `https://api.themoviedb.org/3/search/person?api_key=${APP.KEY}&query=${input.value}&language=en-US`;
      document.getElementById('instructions').style.display = 'none';
      //log(url);

      fetch(url)
         .then(resp => {
            if (resp.ok) {
               return resp.json();
            } else {
               //did not get a HTTP 200 Status
               throw new Error(`ERROR: ${resp.status_code} ${resp.status_message}`);
            }
         })
         .then(data => {
            ACTORS.showActors(data.results);
         })
         .catch(err => {
            //handle the error
            alert(err);
         });
   },

   async getFace(person_id) {
      let url = `${APP.baseURL}person/${person_id}/images?api_key=${APP.KEY}`;

      let resp = await fetch(url);
      if (resp.ok) {
         var data = await resp.json();
         // log(data);
      } else {
         //did not get a HTTP 200 Status
         try {
            throw new Error(`ERROR: ${resp.status_code} ${resp.status_message}`);
         }
         catch (err) {
            alert(err);
         }
      }
      // log(data.profiles[0]);
      if (data.profiles[0]) {
         var imgURL = APP.IMG_BASE_URL + 'w154';
         imgURL += await data.profiles[0].file_path;
      } else return;
      // log(imgURL);
      return imgURL;
   }
};

//actors is for changes connected to content in the actors section
const ACTORS = {
   showActors(results) {
      let content = document.querySelector('section#actors div.content');
      let df = document.createDocumentFragment();

      results.forEach(async (result) => {
         let imgLink = await SEARCH.getFace(result.id);

         // log(imgLink);
         if (imgLink) {
            // log('creating cardDiv');
            let cardDiv = document.createElement('div');
            cardDiv.className = "card";
            let imageDiv = document.createElement('div');
            imageDiv.className = "image";

            let img = document.createElement('img');
            img.src = imgLink;
            img.alt = `${result.name}'s image`;
            imageDiv.append(img);

            let h3 = document.createElement('h3');
            h3.className = "actorName";
            h3.innerHTML = result.name;

            let popularity = document.createElement('p');
            popularity.className = "popularity";
            popularity.innerHTML = `Popularity: ${result.popularity}`;

            cardDiv.append(imageDiv, h3, popularity);
            // df.append(cardDiv);
            content.append(cardDiv);
         }
      });
      content.innerHTML = '';
      // content.append(df);
      document.getElementById('actors').style.display = 'flex';
      document.querySelector('#actors h2').style.display = 'block';

   }
};

//media is for changes connected to content in the media section
const MEDIA = {};

//storage is for working with localstorage
const STORAGE = {
   //this will be used in Assign 4
};

//nav is for anything connected to the history api and location
const NAV = {
   //this will be used in Assign 4
};

//Start everything running
document.addEventListener('DOMContentLoaded', APP.init);