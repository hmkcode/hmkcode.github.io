import { $emit } from "./utils.js";

const SERVICES = {

    EVENTS: {
        ERROR: 'SERVICES.EVENTS:ERROR', 
        USERS_FETCHED: 'SERVICES.EVENTS:USERS_FETCHED', 
        DESTINATIONS_FETCHED: 'SERVICES.EVENTS:DESTINATIONS_FETCHED',
              
    }
    
};


const $services = {

    init: async function() {
        console.log('Services is ready');
    },

    // users
    //======
    get users() {
        return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            $emit(SERVICES.EVENTS.USERS_FETCHED, {data:data}); 
            return data})

        .catch(error =>  {$emit(SERVICES.EVENTS.ERROR, 
            {error:error})});
    },
    set users(value) {
        console.log('Setting users...');
    },

    // destinations (get designations from json file countries.json)
    //=============
    get destinations() {
        return fetch('json/countries.json')
        .then(response => response.json())
        .then(data => {
            $emit(SERVICES.EVENTS.DESTINATIONS_FETCHED, {data:data}); 
            return data})

        .catch(error =>  {$emit(SERVICES.EVENTS.ERROR, 
            {error:error})});
    },


}

export {$services, SERVICES};