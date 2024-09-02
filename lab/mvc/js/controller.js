const $controller =
{
    $model: null,
    $view:null,
    $services:null,

    inject: function(model, view, services)
    {
        this.$model = model;
        this.$view = view;
        this.$services = services;
    },

    init: function()
    {
        
        console.log('DOM is ready');
        this.$services.init();
        this.$model.init();
        this.$view.init();
        console.log('Controller is ready');    
        console.log('MVC is ready');
    },

    changeTitle: function(title)
    {
        this.$view.title.innerHTML = title;
    }
}

export default $controller;