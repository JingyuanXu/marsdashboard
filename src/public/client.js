// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const Immutable = require('immutable')
// const { Immutable } = require('immutable');
import * as Immutable from 'immutable';
let store = {
    user: { name: "Jingyuan" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverData: {},
    roverName: 'Curiosity'
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod ,roverData, roverName} = state

    return `
        <header>Mars Dashboard</header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Image of the day from apod:</h3>
                ${ImageOfTheDay(apod)}
            </section>
            <section>
            <h3>Rover data: </h3>
            ${RoverData(roverData, roverName)}
        </section>
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
            <h1>Welcome, ${name}!</h1>
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
                <img src="${apod.image.url}" height="350px" width="100%" />
                <p>${apod.image.explanation}</p>
            `)
        }
    }
}

const RoverData = (roverData, roverName) => {
    getRoverData(roverName);
    const roverByName = roverData[roverName];

    if (roverByName) {
        return (
            `
                <section>
                  going to insert Rover img
                </section>
                    
            `
        )
    } 
    return `<div> Loading Data... </div>`

}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

}

const getRoverData = (name) => {
    console.log(`http://localhost:3000/rover/${name}`);
    fetch(`http://localhost:3000/rover/${name}`)
        .then(res => res.json())
        .then(({data}) => updateStore(store, 
            {
                roverData: Immutable.set(store.roverData, name, 
                {
                    ...store.roverData[name],
                    ...data
                })
            },
        ))
};


