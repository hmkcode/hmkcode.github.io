import { $emit } from "./utils.js";

const  MODEL = {

    EVENTS: {
        USERS_SET: 'MODEL.EVENTS:USERS_SET',        
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

   _destinations: null,
    get destinations() {
         return this._destinations;
    },
    set destinations(value) {
        this._destinations = value;
        $emit(MODEL.EVENTS.DESTINATIONS_SET, {data:value});
    },

    // <option value="Netherland">
    // <option value="Nigeria">
    // <option value="Norway">
    // <option value="Oman">
    // <option value="Pakistan">
    // <option value="Palau">
    // <option value="Panama">
    // <option value="Papua New Guinea">
   

}

export {$model, MODEL};