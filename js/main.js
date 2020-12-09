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
      searchBtn.addEventListener('click', SEARCH.search);
   },

   buildCard(type) {

   }
}; // end APP nameSpace

//search is for anything to do with the fetch api
const SEARCH = {
   Results: null,

   search(ev) {
      ev.preventDefault()
      let input = document.querySelector('input');
      let url = `${APP.baseURL}search/person?api_key=${APP.KEY}&query=${input.value}&language=en-US`;
      //log(url);
      if (input.value) {
         document.getElementById('instructions').style.display = 'none';

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
               // log(data.results[0]);
            })
            .catch(err => {
               //handle the error
               alert(err);
            });
      } else {
         alert(`Please enter an actor's name.`);
      } // end if input.value
   } // end func
}; // end SEARCH nameSpace

//actors is for changes connected to content in the actors section
const ACTORS = {
   showActors(results) {
      let searchBtn = document.querySelector('#btnSearch');
      searchBtn.style.display = 'none';
      let content = document.querySelector('section#actors div.content');
      let df = document.createDocumentFragment();
      SEARCH.Results = results;

      results.forEach(result => {
         // log(result.known_for);
         if (result.profile_path) {
            // log('creating cardDiv');
            let cardDiv = document.createElement('div');
            cardDiv.className = "card";
            cardDiv.setAttribute('data-actorid', result.id);
            let imageDiv = document.createElement('div');
            imageDiv.className = "image";

            let img = document.createElement('img');
            img.className = "actorImage"
            img.src = APP.IMG_BASE_URL + 'w92' + result.profile_path;
            img.alt = `${result.name}'s image`;
            imageDiv.append(img);

            let h3 = document.createElement('h3');
            h3.className = "cardName";
            h3.innerHTML = result.name;

            let popularity = document.createElement('p');
            popularity.className = "popularity";
            popularity.innerHTML = `Popularity: ${result.popularity}`;

            cardDiv.append(imageDiv, h3, popularity);
            df.append(cardDiv);

         } // end if
      }); // end forEach
      content.innerHTML = '';
      content.append(df);
      document.getElementById('actors').style.display = 'flex';
      document.querySelector('#actors h2').style.display = 'block';
      content.addEventListener('click', MEDIA.showMedia)

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
         // document.getElementById('actors').style.display = 'none';
         let mediaSection = document.getElementById('media');
         let actorsTitle = document.querySelector('#actors h2')
         // mediaTitle.style.display = 'block';

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
         actorsContent.style.display = 'none';
         document.querySelector('.clicked .popularity').innerHTML = `is known for...`;

         mediaSection.classList.remove('off');
         mediaSection.classList.add('on');


         // goes back to Actors page
         actorsTitle.addEventListener('click', () => {
            mediaSection.classList.remove('on');
            mediaSection.classList.add('off');
            document.querySelector('#actors .content').style.display = 'flex';
            actorsContent.append(card);
            card.classList.remove('clicked');
            img.classList.remove('resize');
            // document.querySelector('#actors h2').style.display = 'block';
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
                  img.src = APP.IMG_BASE_URL + 'w92' + movie.poster_path;
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
               });
            }
         });
         content.innerHTML = '';
         content.append(df);
      } // end if
   } // end func
}; // end MEDIA nameSpace

//storage is for working with localstorage
const STORAGE = {
   //this will be used in Assign 4
}; // end STORAGE nameSpace

//nav is for anything connected to the history api and location
const NAV = {
   //this will be used in Assign 4
}; // end NAV nameSpace

//Start everything running
document.addEventListener('DOMContentLoaded', APP.init);