const $services =
{
    getUser: () =>
    {
        return fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => console.log(data));
    },

    init: function()
    {
        console.log('Services is ready');     
          
    }
}

export default $services;