const $services = {

    init: async function() {
        console.log('Services is ready');
    },

    // users
    //======
    get users() {
        console.log("Fetching users asynchronously...");    
        return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .catch(error => { document.dispatchEvent(new CustomEvent('GLOBAL_ERROR_EVENT', {detail: error})); return null });
    },
    set users(value) {
        console.log('Setting users...');
    },

    


}

export default $services;