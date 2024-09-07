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
   },

   

}

export default $model;