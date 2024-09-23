class TripLine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        this._points = []; // To hold the points data
               
    }

    render(points = this._points) {
        if(points.length === 0) return;
        this._points = points;

        this.container = this._renderContainer();

        this._points.sort((a, b) => a.point_order - b.point_order);

        const percentageInterval = 100 / (this._points.length - 1);
        this._points.forEach((pointData, index) => {
            
            var positionPercentage = 0;
             if(index === this._points.length - 1)
                positionPercentage = 100;
            else
                positionPercentage = index * percentageInterval;

            this._renderPoint(pointData, positionPercentage);
        });
        
    }

    _style() {
        const linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('href', '../tripline/style.css');
        this.shadowRoot.appendChild(linkElement);
    }

    _renderContainer() {
        this.shadowRoot.innerHTML = '';
        // if not exits create and append to shadow dom
        if(!this.shadowRoot.getElementById('lineContainer')) {
            const container = document.createElement('div');
            container.classList.add('line-container');
            container.id = 'lineContainer';

            const dashedLine = document.createElement('div');
            dashedLine.classList.add('dashed-line');

            const filledLine = document.createElement('div');
            filledLine.classList.add('filled-line');
            
            container.appendChild(dashedLine);
            container.appendChild(filledLine);

            this.shadowRoot.appendChild(container);
            this._style();
        }
        return this.shadowRoot.getElementById('lineContainer');
    }

    _renderPoint(pointData, positionPercentage) {
       
        const point = this._createPoint();
        this._stylePoint(point, positionPercentage);
        point.style.left = `${positionPercentage}%`;
        this._setPointData(point, pointData);
        this._setPointEvents(point);
      
        this.container.appendChild(point);

    }

    _createPoint() {
        // 1. Create the point element
        const point = document.createElement('div');
        point.classList.add('point');

        const labelContainer = document.createElement('div');
        labelContainer.classList.add('label-container');

        const label = document.createElement('div');
        label.classList.add('label');

        const verticalLine = document.createElement('div');
        verticalLine.classList.add('line');

        labelContainer.appendChild(label);
        labelContainer.appendChild(verticalLine);
        point.appendChild(labelContainer);
        return point;
    }

    _stylePoint(point, position) {	

        const labelContainer = point.querySelector('.label-container');
        const verticalLine = point.querySelector('.line');

        switch (position) {
            case 0:
                labelContainer.classList.add('label-container-start');
                point.classList.add('start-point');
                verticalLine.classList.add('start-end-line');
                break;
            case 100:
                labelContainer.classList.add('label-container-end');
                point.classList.add('end-point');
                verticalLine.classList.add('start-end-line');
                break;
            default:
                break;
        }
    }

    _setPointData(point, pointData) {
        const label = point.querySelector('.label');
        label.textContent = pointData.location_name;
        point.setAttribute('data-id', pointData.point_id);
        point.setAttribute('data-order', pointData.point_order);
    }

    _setPointEvents(point) {
        point.addEventListener('dblclick', (e) => {
            if(e.ctrlKey) return;
            this._handlePointDoubleClick(point);
        });

        if(point.getAttribute('data-order') === '0' || point.getAttribute('data-order') === '100') return;
        this._makeDraggable(point);
    }

    addPoint(newPoint) {      
        if(this._points.length > 4) return; 
        this._points.push(newPoint);
        this.render();
    }

    removePoint(id) {
        this.points = this.points.filter(point => point.point_id !== id);
        this.render();
    }

    // get position of left most point
    _getLeftMostPoint() {
        const container = this.shadowRoot.getElementById('lineContainer');
        const allPoints = Array.from(container.querySelectorAll('.point'));
        const leftMostPoint = allPoints.reduce((leftMost, point) => {
            const pointLeft = point.getBoundingClientRect().left;
            return pointLeft < leftMost ? pointLeft : leftMost;
        }, Infinity);
        return leftMostPoint;
    }

    _makeDraggable(point) {
        // const order = parseInt(point.getAttribute('data-order'), 10);
        // if (order === 0 || order === 100) return;
        const container = this.shadowRoot.getElementById('lineContainer');

        point.addEventListener('mousedown', (e) => {

            if (e.ctrlKey) {
                const onMouseMove = (e) => {
                    point.querySelector('.label').classList.add('dragging');
                    const rect = container.getBoundingClientRect();
                    let newLeft = e.clientX - rect.left;
                    newLeft = Math.max(0, Math.min(newLeft, rect.width));
                    point.style.left = `${newLeft}px`;
                };

                document.addEventListener('mousemove', onMouseMove);

                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    point.querySelector('.label').classList.remove('dragging');
                    this._updatePointOrders(this._sortPointsLeftToRight());
                    this.render();
                }, { once: true });
            }
        });
    }

   

  
    
    _sortPointsLeftToRight() {
        const container = this.shadowRoot.getElementById('lineContainer');
        const allPoints = Array.from(container.querySelectorAll('.point'));
    
        // Sort points from left to right based on their horizontal position
        const sortedPoints = allPoints.sort((a, b) => {
            const aLeft = a.getBoundingClientRect().left;
            const bLeft = b.getBoundingClientRect().left;
            return aLeft - bLeft;
        });
    
    
    
        return sortedPoints;  // Return the sorted array of points
    }

    _updatePointOrders(sortedPoints) {
        // Update the order attribute in this.points array based on the sorted order
        sortedPoints.forEach((point, index) => {
            let newOrder;
            if (index === 0) {
                newOrder = 0; // First point
            } else if (index === sortedPoints.length - 1) {
                newOrder = 100; // Last point
            } else {
                newOrder = index * 10; // In between points (10, 20, 30, ...)
            }
    
            const pointId = point.getAttribute('data-id');
            
            // Find the corresponding point in this.points and update its order
            const pointData = this._points.find(p => p.point_id.toString() === pointId);
            if (pointData) {
                pointData.point_order = newOrder;
                point.setAttribute('data-order', newOrder); // Also update the DOM element's data-order attribute
            }
        });
    
        const event = new CustomEvent('pointsorderupdatedevent', {
            detail: { points: this.points }
        });
        this.dispatchEvent(event);
    }


   
    
   
    
    _handlePointDoubleClick(pointData) {
        const event = new CustomEvent('pointdoubleclicked', {
            detail: { point: pointData }
        });
        this.dispatchEvent(event);
    }
}

// Define the custom element
customElements.define('trip-line', TripLine);
