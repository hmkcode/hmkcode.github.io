class CustomText extends HTMLElement {
    constructor() {
        super();
              
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
     
    }
    // Method to update the text
    text(newText) {
        this.textElement.textContent = newText;
    }
}

// Define the new custom element
customElements.define('custom-text', CustomText);
