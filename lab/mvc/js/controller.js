const $controller =
{
   
    $model: null,
    $view:null,
    $services:null,

    init: function(model, view, services)
    {
        this.$model = model;
        this.$view = view;
        this.$services = services;

        if(!this.$model || !this.$view || !this.$services)
        {
            console.error('MVC is not ready');
            return;
        }

        this.$services.init();
        this.$model.init();
        this.$view.init();
        console.log('Controller is ready');  
        
        this.initEventListeners();
        this.initServices();
    },


    // REGISTERING EVENT LISTENERS ...
    initEventListeners() {
        this.$view.addButton.click = this.onAddButtonClicked.bind(this);
        this.$view.title.hover = this.onTitleHovered.bind(this);
        this.$view.customText.click = this.onCustomTextButtonClicked.bind(this);
        this.$view.GLOBAL_ERROR_EVENT = this.onGlobalError.bind(this);
    },

    async initServices() {
        this.$model.users= await this.$services.users;
    },


    // EVENT HANDLERS ...
    onAddButtonClicked: function()
    {
        console.log('Add button clicked');
        this.$view.title = 'New Title';
    },

    onTitleHovered() {
        console.log('Title hovered');
    },

    onCustomTextButtonClicked: function()
    {
        console.log('Custome button clicked');
        this.$view.customText = 'Custom Text Clicked!';
    },

    onGlobalError: function(event)
    {
        this.$view.toast.show(event.detail, 'error');	
    },

    // RENDEREING ...

    render: function(view, model)
    {
        this.$view[view] = model;
    },

}

export default $controller;