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
      let searchBtn = document.querySelector('#btnSearch');
      searchBtn.addEventListener('click', SEARCH.checkSearch);
      STORAGE.loadStorage();
   },

   buildCard(result, type) {

      let cardDiv = document.createElement('div');
      cardDiv.classList.add('card', 'horizontal', 'col', 's12', 'm6', 'l4', 'hoverable');
      cardDiv.setAttribute('data-actorid', result.id);

      let imageRowDiv = document.createElement('div');
      imageRowDiv.classList.add('imageRow', 'row');

      let cardGridDiv = document.createElement('div');
      cardGridDiv.classList.add('cardGrid', 'col', 's12');

      let imgDiv = document.createElement('div');
      imgDiv.classList.add('card-image', 'col', 's4');

      let img = document.createElement('img');
      img.classList.add('actorImage');
      img.src = APP.IMG_BASE_URL + 'w185' + result.profile_path;
      img.alt = `${result.name}'s image`;

      let cardStackDiv = document.createElement('div');
      cardStackDiv.classList.add('card-stacked');

      let cardBodyDiv = document.createElement('div');
      cardBodyDiv.classList.add('card-content', 'col', 's8', 'center-align', 'flow-text');

      let h3 = document.createElement('h3');
      h3.className = "cardName";
      h3.innerHTML = result.name;


      let popularity = document.createElement('p');
      popularity.className = "popularity";
      popularity.innerHTML = `Popularity: ${result.popularity}`;

      imgDiv.append(img);
      cardGridDiv.append(imgDiv);
      cardBodyDiv.append(h3, popularity);
      cardGridDiv.append(cardBodyDiv);
      imageRowDiv.append(cardGridDiv);
      cardDiv.append(imageRowDiv, cardGridDiv);
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
            STORAGE.setStorage(input, data.results);
            SEARCH.results = data.results;
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

      let contentArea = document.querySelector('#actors .row');
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
      NAV.hideShowContent('#actors', 'flex');
      NAV.hideShowContent('#actors h2', 'block');
      contentArea.addEventListener('click', MEDIA.showMedia)

   } // end func
}; // end this.nameSpace

//media is for changes connected to content in the media section
const MEDIA = {
   showMedia(ev) {
      let myClass = ev.target.className;
      let target = ev.target;
      let card;
      //ev.target.closest('[data-actorid])
      if (myClass === 'card' ||
         target.parentElement.className === 'card' ||
         myClass === 'actorImage') {

         let mediaSection = document.getElementById('media');
         let actorsTitle = document.querySelector('#actors h2');

         // always select cardDiv
         if (myClass === 'card') {
            card = target;
         } else if (myClass === 'actorImage') {
            card = target.parentElement.parentElement;
         } else {
            card = target.parentElement;
         }
         log(SEARCH.Results);
         card.classList.add('clicked');
         let img = document.querySelector('.clicked .actorImage');
         img.classList.add('resize');
         // push clicked card to the top
         let main = document.querySelector('main');
         main.insertBefore(card, main.firstChild);

         let actorsContent = document.querySelector('#actors .content')
         NAV.hideShowContent('#actors .content', 'none');
         document.querySelector('.clicked .popularity').innerHTML = `is known for...`;

         mediaSection.classList.remove('off');
         mediaSection.classList.add('on');


         // goes back to Actors page
         actorsTitle.addEventListener('click', () => {
            mediaSection.classList.remove('on');
            mediaSection.classList.add('off');
            NAV.hideShowContent('#actors .content', 'flex');
            actorsContent.append(card);
            card.classList.remove('clicked');
            img.classList.remove('resize');
         }); // end listener

         let id = card.dataset.actorid;
         let content = document.querySelector('section#media div.content');
         let df = document.createDocumentFragment();
         // log(SEARCH.Results);
         SEARCH.Results.forEach(person => {
            // use .find instead
            if (person.id == id) {
               person.known_for.forEach(movie => {

                  let cardDiv = document.createElement('div');
                  cardDiv.className = "card";
                  let imageDiv = document.createElement('div');
                  imageDiv.className = "image";

                  let img = document.createElement('img');
                  img.src = APP.IMG_BASE_URL + 'w185' + movie.poster_path;
                  img.alt = `poster for ${movie.title}`;
                  imageDiv.append(img);

                  let h3 = document.createElement('h3');
                  h3.className = "cardName";

                  let vote = document.createElement('p');
                  vote.className = "vote";
                  vote.innerHTML = `Rating: ${movie.vote_average}`;

                  if (movie.media_type === 'movie') {
                     h3.innerHTML = movie.title;

                  } else {
                     h3.innerHTML = movie.name;
                  }

                  cardDiv.append(imageDiv, h3, vote);
                  df.append(cardDiv);
               }); // end inner forEach
            }
         }); // end outer forEach
         content.innerHTML = '';
         content.append(df);
      } // end if
   } // end func
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