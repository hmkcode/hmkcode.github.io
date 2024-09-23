import { $emit } from "./utils.js";

const  MODEL = {

    EVENTS: {
        USERS_SET: 'MODEL.EVENTS:USERS_SET',        
        DESTINATIONS_SET: 'MODEL.EVENTS:DESTINATIONS_SET',
    }
    
};

const $model =
{
   init: function()
   {
       console.log('Model is ready');     
   },

   // users model
   //============ 
   _users: null,
   get users() {
       return this._users;
   },
   set users(value) {
       this._users = value;
       $emit(MODEL.EVENTS.USERS_SET, {data:value});
   },

   // destinations model
   //=================== 

   _destinations: null,
    get destinations() {
         return this._destinations;
    },
    set destinations(value) {
        this._destinations = value;
        $emit(MODEL.EVENTS.DESTINATIONS_SET, {data:value});
    },

    // createGetterSetter: function(propertyName, eventName) {
    //     let value = null;
    //     Object.defineProperty(this, propertyName, {
    //         get: function() {
    //             return value;
    //         },
    //         set: function(newValue) {
    //             value = newValue;
    //             $emit(eventName, { data: newValue });
    //         }
    //     });
    // }
   
    // cols 
    // ====
    _cols: [
        {name: 'ID', data: 'id', sortable: true, index:true, data_type:'number'},
        {name: 'Name', data: 'name', sortable: true},
        {name: 'Email', data: 'email'},
    ],
    get cols() {
        return this._cols;
    },
}

// $model.createGetterSetter('_users', MODEL.EVENTS.USERS_SET);
// $model.createGetterSetter('_destinations', MODEL.EVENTS.DESTINATIONS_SET);


export {$model, MODEL};