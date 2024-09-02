class CustomText extends HTMLElement {
    constructor() {
        super();
        
        // Define the HTML structure as a string
      

      
    }

    connectedCallback() {
        this.render();
    }

    render() {

        this.innerHTML = `
        <button>Change Text</button>
        <span>Initial Text</span>
        `;

      // Get the button and text elements after they have been rendered
      this.buttonElement = this.querySelector('button');
      this.textElement = this.querySelector('span');

      // Add event listener to the button to change the text
      this.buttonElement.addEventListener('click', () => {
          this.text('New Text');
      });
    }
    // Method to update the text
    text(newText) {
        this.textElement.textContent = newText;
    }
}

// Define the new custom element
customElements.define('custom-text', CustomText);
