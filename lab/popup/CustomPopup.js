class CustomPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Creating the popup structure
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                }
                #popup-content {
                    position: relative;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 90%;
                    max-height: 90%;
                    overflow: auto;
                    z-index: 1001;
                }
                #popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                }
            </style>
            <div id="popup-overlay"></div>
            <div id="popup-content"></div>
        `;

        this.popupContent = this.shadowRoot.getElementById('popup-content');
        this.popupOverlay = this.shadowRoot.getElementById('popup-overlay');

        // Event listener to close the popup when clicking on the overlay
        this.popupOverlay.addEventListener('click', () => this.close());
    }

    // Show the popup with the specified content element
    show(elementId) {
        
        const content = document.getElementById(elementId);
        if (content) {
            this.popupContent.innerHTML = '';
            const cotentCloned = content.cloneNode(true);
            this.popupContent.appendChild(cotentCloned);
            cotentCloned.style.display = 'block';
            this.style.display = 'flex';
        }
    }

    // Close the popup
    close() {
        this.style.display = 'none';
        this.popupContent.innerHTML = '';
    }
}

customElements.define('custom-popup', CustomPopup);