import { VIEWS, $view } from "./view.js";
import { SERVICES, $services } from "./services.js";
import { MODEL, $model } from "./model.js";
import { $emit, $on } from "./utils.js";

const  CONTROLLER = {

    EVENTS: {
        INITALIZED: 'CONTROLLER.EVENTS:INITIALIZED',        
    }
    
};

const $controller =
{
   

    init:  function()
    {
        $services.init();
        $model.init();
        $view.init();
        console.log('Controller is ready');  
        this.$regsiter_listeners();
      

        //this.users();

        $emit(CONTROLLER.EVENTS.INITALIZED, {source:'$controller.init'});

    },
 

    // EVENT HANDLERS ...
    $listeners: {

        [CONTROLLER.EVENTS.INITALIZED]: function(event){
            $services.users;
            $services.destinations;
        },

        [VIEWS.EVENTS.ADD_BUTTON_CLICK]:function(){
            $view.title = 'New Title';
        },

        [VIEWS.EVENTS.TITLE_MOUSEOVER]: function() {
            console.log('Title hovered');
        },

        [VIEWS.EVENTS.CUSTOME_TEXT_CLICK]:function(){
            $view.customText = 'Custom Text Clicked!'
        },

        [SERVICES.EVENTS.ERROR]:function(event){
            $view.toast = {message: event.error.detail, style:'error'}
        },        

        [SERVICES.EVENTS.USERS_FETCHED]:function(event){
            $model.users = event.detail.data
        },
        [SERVICES.EVENTS.DESTINATIONS_FETCHED]:function(event){
            $model.destinations = event.detail.data
        },

        [MODEL.EVENTS.USERS_SET]:function(event){
            $view.users = event.detail.data
        },
        [MODEL.EVENTS.DESTINATIONS_SET]:function(event){
            $view.countries = event.detail.data.countries
        },
       
    },

    $regsiter_listeners: function(){       
        Object.keys(this.$listeners).forEach(event => {
                $on(document, event, this.$listeners[event].bind(this));
        });
    },

    async users(){
        console.log('Fetching users...');
        $view.users = $model.users = await $services.users;
    },
   


    // RENDEREING ...

    render: function(view, model)
    {
        $view[view] = model;
    },

}

export default $controller;