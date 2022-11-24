class Clippy extends HTMLElement {
    OFFSET = 100;
    static get markup() { 
        return `
            <button id="button-a">
              Click me to solve all your problems!
            </button>
        `;
    }

    constructor(){
        // Always call super first in constructor
        super();
        const template = document.createElement('template');
        template.innerHTML = this.constructor.markup;
        this.setAttribute("class", "base");
        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'
        // Create spans
        const wrapper = document.createElement("span");
        wrapper.setAttribute("class", "wrapper");
        // Insert icon from defined attribute or default icon
        const icon = wrapper.appendChild(document.createElement("span"));
        icon.setAttribute("class", "icon");
        icon.setAttribute("tabindex", 0);
        const info = document.createElement('span');
        info.setAttribute('class', 'info');
        // Take attribute content and put it inside the info span
        const text = this.getAttribute('data-text');
        info.textContent = text;
        // Insert icon
        let imgUrl = this.hasAttribute('img') 
            ? this.getAttribute('img')
            : 'henohenomoheji-clippy.png';
        const img = document.createElement('img');
        img.src = imgUrl;
        icon.appendChild(img);
        // Always include descriptive text when adding an image
        img.alt = this.hasAttribute("alt")
            ? this.getAttribute("alt")
            : "Japanese Clippy";
        // Add external CSS file
        const styleLink = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "style.css");
        // Attach the created elements to the shadow dom
        shadow.appendChild(styleLink);
        shadow.appendChild(wrapper);
        wrapper.appendChild(icon);
        wrapper.appendChild(info);
        shadow.appendChild(template.content.cloneNode(true));
        this.initializeElements();
    }

    initializeElements() {
        this.button = this.shadowRoot.querySelector('#button-a');
    }

    connectedCallback() {
        this.addEventListeners();
    }
    
    disconnectedCallback() {
        this.removeEventListeners();
    }

    addEventListeners() {
        this.pressedCallback = this.buttonPressed.bind(this);
        this.button.addEventListener('click', this.pressedCallback);

        document.addEventListener('mousemove', (e) => {
            const x = e.pageX;
            const y = e.pageY;
            const btnBox = this.button.getBoundingClientRect();
            const horizontalDistFrom = this.distanceFromCenter(
                btnBox.x, x, btnBox.width);
            const verticalDistFrom = this.distanceFromCenter(
                btnBox.y, y, btnBox.width);
            const hOffset = btnBox.width / 2 + this.OFFSET;
            const vOffset = btnBox.height / 2 + this.OFFSET;
            if (Math.abs(horizontalDistFrom) <= hOffset
                && Math.abs(verticalDistFrom) <= vOffset){
                    this.setButtonPosition(
                        btnBox.x + hOffset / horizontalDistFrom * 10,
                        btnBox.y + vOffset / verticalDistFrom * 10);
            }
        });
    }

    distanceFromCenter(boxPos, mousePos, boxSize){
        return boxPos - mousePos + boxSize / 2;
    }

    setButtonPosition(left, top){
        const windowBox = document.body.getBoundingClientRect();
        const buttonBox = this.button.getBoundingClientRect();
        if(this.distanceFromCenter(left, windowBox.left, buttonBox.width) < 0){
            left = windowBox.right - buttonBox.width - this.OFFSET;
        }
        if(this.distanceFromCenter(left, windowBox.right, buttonBox.width) > 0){
            left = windowBox.right - buttonBox.width - this.OFFSET;
        }
        if(this.distanceFromCenter(top, windowBox.top, buttonBox.height) < 0){
            top = windowBox.bottom - buttonBox.height - this.OFFSET;
        }
        if(this.distanceFromCenter(top, windowBox.bottom, buttonBox.height) > 0){
            left = windowBox.top - buttonBox.height - this.OFFSET;
        }
        this.button.style.left = `${left}px`
        this.button.style.top = `${top}px`
    }

    removeEventListeners() {
        this.button.removeEventListener('click', this.pressedCallback);
    }
    
    buttonPressed() {
        alert('Nice try!');
        window.location.reload();
    }

}

customElements.define('jpn-clippy', Clippy);