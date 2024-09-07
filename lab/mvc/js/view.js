const VIEWS = {
    ADD_BUTTON: 'add-button',
    TITLE: 'title',
    USERS: 'users',
    TEST: 'test',
    CUSTOME_TEXT: 'custom-text',
    TOAST: 'toast'
    
};

const TEMPLATES = {
    USER: 'user-template'
}

const $view =
{
    init: function()
    {
        console.log('View is ready');     
    
    },

    // VIEW
    //=====
    set GLOBAL_ERROR_EVENT(listener) {
            $log('GLOBAL_ERROR_EVENT listener is set');
            document.addEventListener('GLOBAL_ERROR_EVENT', listener);

    },
   

    // VIEW.CUSTOME_TEXT "<custom-text>"
    //==================================
    get customText() {
       return {
        set click(value) {
            $onEvent($e(VIEWS.CUSTOME_TEXT).buttonElement, 'click', value);
        }
       }
    },
    set customText(value) {
        $log('Setting custom text');
        $e(VIEWS.CUSTOME_TEXT).text(value);
    },

    // VIEWS.ADD_BUTTON <button>
    //==========================
    addButton:
    {
        set click(value) {
            $onEvent($e(VIEWS.ADD_BUTTON), 'click', value);
        },
    },


    // VIEWS.TITLE
    // ============ 
    get title() {
        return {            
            get text() {
                return $text($e(VIEWS.TITLE));
            },
            set text(value) {
                $text($e(VIEWS.TITLE), value);
            },
            set hover(value) {
                $onEvent($e(VIEWS.TITLE), 'mouseover', value);
            }
        };
    },
    set title(value) {
        $text($e(VIEWS.TITLE), value);
    },

    // VIEW | users
    //=============
    get users() {
        return null;
    },
    set users(data) {
        
        $build($e(VIEWS.USERS), $e(TEMPLATES.USER), data, (clone, item) => {
            $text($select_one('.name', clone), item.name);
            $text($select_one('.email', clone), item.email);
        });
    },
   
    // VIEWS.TOAST <toast-comp>
    //=========================
    toast: {        
        show: function(message, style = 'info') {
            $e(VIEWS.TOAST).show(message, style);
        }
    },
    
    
}

export default $view;