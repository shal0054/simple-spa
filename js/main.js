//app is for general control over the application
//and connections between the other components
const log = console.log;

const APP = {
   KEY: "67a8835b5b606f17a40522e9ff643ea8",
   baseURL: 'https://api.themoviedb.org/3/',
   // get urlConfig() {
   //    return `${this.baseURL}configuration?api_key=${this.KEY}`
   // },
   IMG_BASE_URL: 'https://image.tmdb.org/t/p/',

   init: () => {
      //this function runs when the page loads
      document.querySelector('#btnSearch').addEventListener('click', SEARCH.checkSearch);
      document.querySelector('#pageTitle').addEventListener('click', () => { location.reload() });
      STORAGE.loadStorage();
   },

   buildCard(result, type) {

      let cardDiv = document.createElement('div');
      cardDiv.classList.add('oneCard', 'col', 's12', 'm6', 'l4');

      let rowDiv = document.createElement('div');
      rowDiv.classList.add('row');

      let cardGridDiv = document.createElement('div');
      cardGridDiv.classList.add('cardGrid', 'col', 's12');

      let card = document.createElement('div');
      card.classList.add('card', 'horizontal', 'hoverable');

      let imgDiv = document.createElement('div');
      imgDiv.classList.add('card-image');

      let img = document.createElement('img');

      let cardStackDiv = document.createElement('div');
      cardStackDiv.classList.add('card-stacked');

      let h3 = document.createElement('h3');
      h3.className = "cardName";

      let cardContentDiv = document.createElement('div');
      cardContentDiv.classList.add('card-content');

      let p = document.createElement('p');

      if (type === 'actor') {

         cardDiv.setAttribute('data-actorid', result.id);

         img.classList.add('actorImage');
         img.src = APP.IMG_BASE_URL + 'w185' + result.profile_path;
         img.alt = `${result.name}'s image`;

         h3.innerHTML = result.name;

         p.className = "popularity";
         p.innerHTML = `Popularity: ${result.popularity}`;

      } // end if

      cardContentDiv.append(h3, p);

      imgDiv.append(img);
      cardStackDiv.append(cardContentDiv);
      card.append(imgDiv, cardStackDiv);
      cardGridDiv.append(card);
      rowDiv.append(cardGridDiv);
      cardDiv.append(rowDiv);
      return cardDiv;
   },

   sortBtns(io) {
      if (io === 'on') {
         NAV.hideShowContent('.sort-btns', 'inline-flex');
         document.querySelector('#sNameBtn').addEventListener('click', APP.cardSort);
         document.querySelector('#sPopBtn').addEventListener('click', APP.cardSort);
      } else {
         NAV.hideShowContent('.sort-btns', 'none');
      }
   },

   cardSort(ev) {
      let clicked = ev.target.closest('.btn-flat').firstElementChild;
      let sortedArr = null;
      // flip arrows
      if (clicked.innerHTML === 'keyboard_arrow_up') {
         clicked.innerHTML = 'keyboard_arrow_down';

         if (clicked.id === 'nameArrow') {
            sortedArr = STORAGE.sorting('name');
            ACTORS.showActors(sortedArr);
         } else {
            sortedArr = STORAGE.sorting('popularity');
            ACTORS.showActors(sortedArr);
         }

      } else {
         clicked.innerHTML = 'keyboard_arrow_up';

         if (clicked.id === 'nameArrow') {
            sortedArr = STORAGE.sorting('name');
            ACTORS.showActors(sortedArr.reverse());
         } else {
            sortedArr = STORAGE.sorting('popularity');
            ACTORS.showActors(sortedArr.reverse());
         }

      } // end outer if

   }
}; // end APP nameSpace

//search is for anything to do with the fetch api
const SEARCH = {
   results: [],

   checkSearch(ev) {
      ev.preventDefault();
      let input = document.querySelector('#search').value.toLowerCase();

      if (input) {

         NAV.hideShowContent('#instructions', 'none');
         NAV.hideShowContent('footer', 'none');

         let key = STORAGE.BASE_KEY + input;

         if (STORAGE.keys.includes(key)) { // existing query
            SEARCH.results = STORAGE.getStorage(key);
            ACTORS.showActors(SEARCH.results);
         } else { // a brand new search query
            SEARCH.doFetch(input);
         }

      } else {
         alert(`Please enter an actor's name.`);
      }// end outer if
   },

   doFetch(input) {
      let url = `${APP.baseURL}search/person?api_key=${APP.KEY}&query=${input}&language=en-US`;
      // let mediaSection = document.getElementById('media');
      // mediaSection.classList.remove('on');
      // mediaSection.classList.add('off');
      log('Doing a Fetch');
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
            SEARCH.results = data.results;
            STORAGE.setStorage(input, data.results);
            ACTORS.showActors(data.results);
         })
         .catch(err => {
            //handle the error
            alert(err);
         });

   } // end search func
}; // end SEARCH nameSpace

//actors is for changes connected to content in the actors section
const ACTORS = {
   showActors(results) {

      let contentArea = document.querySelector('#cardContainer');
      let df = document.createDocumentFragment();

      APP.sortBtns('on');

      results.forEach(result => {

         if (result.profile_path) {

            let cardDiv = APP.buildCard(result, 'actor');

            df.append(cardDiv);

         } // end if
      }); // end forEach

      contentArea.innerHTML = '';
      contentArea.append(df);
      NAV.hideShowContent('#actors', 'block');
      // NAV.hideShowContent('#actors h2', 'block');
      contentArea.addEventListener('click', MEDIA.showMedia)

   } // end func
}; // end this.nameSpace

//media is for changes connected to content in the media section
const MEDIA = {
   showMedia(ev) {
      let actorId = ev.target.closest('.card').dataset.actorid;
      let contentArea = document.querySelector('#media .content');
      let df = document.createDocumentFragment();
      debugger;
      SEARCH.results.forEach(person => {

         if (person.id == actorId) {

            person.known_for.forEach(media => {
               let cardDiv = null;
               if (media.media_type === 'movie') {

                  cardDiv = APP.buildCard(media, 'movie');

               } else {
                  cardDiv = APP.buildCard(media, 'tv');
               } // end inner if

               df.append(cardDiv);

            }); // end inner loop

         } // end outer if

      }); // end outer loop
      contentArea.innerHTML = '';
      contentArea.append(df);
   } // end showMedia func
}; // end MEDIA nameSpace

//storage is for working with localstorage
const STORAGE = {
   keys: [],

   BASE_KEY: 'Karim-Actors-Search-',

   sorting(prop) {
      let newArr = Array.from(SEARCH.results);
      newArr.sort(function (a, b) {
         if (a[prop] > b[prop]) {
            return 1
         } else if (b[prop] > a[prop]) {
            return -1
         } else {
            return 0
         }
      });
      return newArr;
   },

   loadStorage() {
      //go to localstorage and retrieve all the keys that start with APP.keybase
      let num = localStorage.length;
      if (num) {
         STORAGE.keys = []; //reset the keys array
         for (let i = 0; i < num; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(STORAGE.BASE_KEY)) {
               STORAGE.keys.push(key);
            }
         }
      }
   },

   getStorage(key) {
      let storage = localStorage.getItem(key);
      storage = JSON.parse(storage)
      return storage;
   },

   setStorage(input, results) {
      let key = STORAGE.BASE_KEY + input;
      localStorage.setItem(key, JSON.stringify(results));
      STORAGE.keys.push(key);
   }
}; // end STORAGE nameSpace

//nav is for anything connected to the history api and location
const NAV = {
   hideShowContent(item, vis) {
      document.querySelector(item).style.display = vis;
   }
}; // end NAV nameSpace

//Start everything running
document.addEventListener('DOMContentLoaded', APP.init);