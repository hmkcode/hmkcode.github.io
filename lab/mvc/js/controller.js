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
        document.addEventListener('DOMContentLoaded', () =>
        {
            console.log('DOM is ready');
            console.log('this', this)
            this.$services.getUser();
            this.$view.changeTitle('Hello World 3');
        });
        console.log('Controller is ready');
    }
}

export default $controller;