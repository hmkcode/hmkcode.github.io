class GenericToast extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      // Create a link element to reference the external CSS file
      const linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.setAttribute('href', '/toast/toast-style.css'); // Reference to the external CSS file
  
      // Create the toast container
      const toastContainer = document.createElement('div');
      toastContainer.setAttribute('class', 'toast');
      toastContainer.setAttribute('id', 'toast');
  
      // Append the link and toast container to the shadow DOM
      this.shadowRoot.appendChild(linkElement);
      this.shadowRoot.appendChild(toastContainer);
    }
  
    // Show the message with a specific style (error, info, success, confirm)
    show(message, style = 'info') {
      const toast = this.shadowRoot.querySelector('#toast');
      toast.textContent = message;
      toast.className = `toast show ${style}`;
      
      // Automatically hide after 3 seconds
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
  
    // Hide the toast
    hide() {
      const toast = this.shadowRoot.querySelector('#toast');
      toast.classList.remove('show');
    }
  }
  
  // Define the custom element
  customElements.define('toast-comp', GenericToast);
  