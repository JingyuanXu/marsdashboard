import * as Immutable from 'immutable';
import './assets/stylesheets/resets.css'
import './assets/stylesheets/index.css'
let store = {
    user: { name: "DemoUser" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: [],
    generalDetails: Immutable.List()
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}
const render = async (root, state) => {
    root.innerHTML = App(state)
    const roverLinks = Array.from(document.querySelectorAll('li'));
    roverLinks.map(li => {
        li.addEventListener('click', event => {
            getRoverData(event.target.innerText.toLowerCase());
        });
    });
}



// create content
const App = (state) => {
    let {apod} = state

    return `
        <header> 
        ${ImageOfTheDay(apod)}
        
        </header>
        <main>
            
            ${createMenu(store.rovers)}
            
            <div>
                ${getPhotos(store.photos)}
            </div>
        
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h2>Welcome, ${name}!</h2>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    // console.log(photodate.getDate(), today.getDate());

    // console.log(photodate.getDate() === today.getDate());
    if (!apod.image || apod.image.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    // check if the photo of the day is actually type video!
    if (apod.image) {
        if (apod.image.media_type === "video") {
            return (`
                <p>See today's featured video <a href="${apod.image.url}">here</a></p>
                <p>${apod.image.title}</p>
                <p>${apod.image.explanation}</p>
            `)
        } else {
            return (`
            <div class="post-container">                
            <div class="post-thumb"><img src="${apod.image.url}"  height= "200px" width = "100%"/></div>
            <div class="post-content">
                <h3 class="post-title">${Greeting(store.user.name)}</h3>
                <p>${apod.image.explanation}</p>
            </div>


                
                
            `)
        }
    }
}

const createMenu = rovers => (
    `
    <ul class="nav navbar-nav">
        ${rovers
        .map(rover =>
            `<li><a href="#">${rover}</a></li>`)
        .join("")}
    </ul>
    `
)


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

}

const getPhotos = (photos) => {
    let imageHtml = '';
    photos.map(photo => {
        imageHtml += `
        <div>
        <br/>
        <br/>
        <br/>

        <h3>${store.generalDetails.get(0)}</h3>
        <h3>Landing Date: ${store.generalDetails.get(1)}</h3>
        <h3>Launch Date:${store.generalDetails.get(2)}</h3>
        <h3>Status: ${store.generalDetails.get(3)}</h3>
        <p>Earth Date: ${photo[1]}</p>
        <img class = "photo" src="${photo[0]}">
        </div>
    `
    })
    return imageHtml;
};



const getRoverData = name => {
    fetch(`http://localhost:3000/rover/${name}`)
        .then(res => res.json())
        .then(data => {
            let photoData = [];

            data.image.photos.map(rover => {
                let array = [rover.img_src, rover.earth_date]
                photoData.push(array)
            });
          
            let dataExist = data.image.photos[0];
            if (dataExist){
                let newStore = {
                    user: { name: "DemoUser" },
                    apod: '',
                    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
                    photos: photoData,
                    generalDetails: Immutable.List.of(dataExist.rover.name,dataExist.rover.landing_date,dataExist.rover.launch_date,dataExist.rover.status)
                }
                
                updateStore(store, newStore);
            }
            
        })
};

