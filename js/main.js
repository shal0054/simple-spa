//app is for general control over the application
//and connections between the other components
const APP = {
   KEY: "67a8835b5b606f17a40522e9ff643ea8",
   baseURL: 'https://api.themoviedb.org/3/',
   get urlConfig() {
      return `${this.baseURL}configuration?api_key=${this.KEY}`
   },
   SECURE_BASE_URL: 'https://image.tmdb.org/t/p/',

   init: () => {
      //this function runs when the page loads
      // input.addEventListener('input', SEARCH);
      let searchBtn = document.querySelector('#btnSearch');
      searchBtn.addEventListener('click', SEARCH.search);
   }
};


//search is for anything to do with the fetch api
const SEARCH = {
   search(ev) {
      ev.preventDefault()
      let input = document.querySelector('input');
      let url = `https://api.themoviedb.org/3/search/person?api_key=${APP.KEY}&query=${input.value}&language=en-US`;
      document.getElementById('instructions').style.display = 'none';
      // console.log(url);

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

   getFace(person_id) {
      let url = `https://api.themoviedb.org/3/person/${person_id}/images?api_key=67a8835b5b606f17a40522e9ff643ea8`;
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
            console.log(data)
         })
         .catch(err => {
            //handle the error
            alert(err);
         });
   }
};

//actors is for changes connected to content in the actors section
const ACTORS = {
   showActors(results) {
      document.getElementById('actors').style.display = 'visible';
      document.querySelector('#actors h2').style.display = 'visible';
      console.log(results[0].popularity);
      SEARCH.getFace(results[0].id);
      let content = document.querySelector('section#actors div.content');
      let df = document.createDocumentFragment();

      results.forEach(result => {
         let cardDiv = document.createElement('div');
         cardDiv.className = "card";
         let imageDiv = document.createElement('div');
         imageDiv.className = "image";

         let img = document.createElement('img');
         img.src = 'https://image.tmdb.org/t/p/w185/eze9FO9VuryXLP0aF2cRqPCcibN.jpg';
         img.alt = `${result.name}'s image`;
         imageDiv.append(img);

         let h3 = document.createElement('h3');
         h3.className = "ActorName";
         h3.innerHTML = result.name;

         let popularity = document.createElement('p');
         popularity.className = "popularity";
         popularity.innerHTML = `Popularity: ${result.popularity}`;

         cardDiv.append(imageDiv, h3, popularity);
         df.append(cardDiv);
      })
      content.innerHTML = '';
      content.append(df);
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