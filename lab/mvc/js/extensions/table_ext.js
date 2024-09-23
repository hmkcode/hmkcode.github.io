// make table.thead getter and setter
Object.defineProperty(HTMLTableElement.prototype, 'thead', {
    get: function() {
        if (!this.querySelector('thead')) {
            const thead = document.createElement('thead');
            this.insertBefore(thead, this.firstChild);
        }

        return this.querySelector('thead');
    },
});

// make table.tbody getter and setter
Object.defineProperty(HTMLTableElement.prototype, 'tbody', {
    get: function() {
        if (!this.querySelector('tbody')) {
            const tbody = document.createElement('tbody');
            this.appendChild(tbody);
        }
        return this.querySelector('tbody');
    },
});

// make table.tfoot getter and setter
Object.defineProperty(HTMLTableElement.prototype, 'tfoot', {
    get: function() {
        if(!this.querySelector('tfoot')) {
            const tfoot = document.createElement('tfoot');
            this.appendChild(tfoot);
        }
        return this.querySelector('tfoot');
    },
});

// Function to filter rows based on search query
HTMLTableElement.prototype.filterRows = function(query) {
    const rows = this.tbody ? this.tbody.rows : [];
    const lowerCaseQuery = query.toLowerCase();

    Array.from(rows).forEach(row => {
        const cells = Array.from(row.cells);
        const matches = cells.some(cell => cell.textContent.toLowerCase().includes(lowerCaseQuery));
        row.dataset.matches = matches ? 'true' : 'false';
        row.style.display = matches ? '' : 'none';
    });

    this.paginate(5, true);
};

// Function to paginate rows
HTMLTableElement.prototype.paginate = function(maxRowsPerPage, isFiltered = false) {
    this.maxRowsPerPage = maxRowsPerPage;
    const rows = Array.from(this.tbody ? this.tbody.rows : []);
    const filteredRows = isFiltered ? rows.filter(row => row.dataset.matches === 'true') : rows;
    const totalPages = Math.ceil(filteredRows.length / maxRowsPerPage);
    let currentPage = 1;

    const renderPage = (page) => {
        const start = (page - 1) * maxRowsPerPage;
        const end = start + maxRowsPerPage;

        rows.forEach(row => {
            row.style.display = 'none';
        });

        filteredRows.slice(start, end).forEach(row => {
            row.style.display = '';
        });

     
        renderFooter(page);
    };

    const renderFooter = (page) => {
        let tfoot = this.querySelector('tfoot');
        if (!tfoot) {
            tfoot = document.createElement('tfoot');
            this.appendChild(tfoot);
        }
        tfoot.innerHTML = '';

        const footerRow = document.createElement('tr');
        const footerCell = document.createElement('td');
        footerCell.colSpan = this.thead ? this.thead.rows[0].cells.length : 1;

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.style.margin = '0 5px';
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                renderPage(i);
            });

            if (i === page) {
                pageLink.style.fontWeight = 'bold';
            }

            footerCell.appendChild(pageLink);
        }

        footerRow.appendChild(footerCell);
        tfoot.appendChild(footerRow);
    };

    renderPage(currentPage);
};

HTMLTableElement.prototype.build = function(cols, data, pageLength = 5) {
    // Build table header
    this.innerHTML = '';
    const thead = this.createTHead();
    const headerRow = thead.insertRow();
    cols.forEach((col, index) => {
        const th = document.createElement('th');
        th.textContent = col.name;
        if (col.sortable) 
            th.setAttribute('d-sortable', 'true');
        if(col.data_type)
            th.setAttribute('d-datatype', col.data_type);
        else
            th.setAttribute('d-datatype', 'text');
        
        headerRow.appendChild(th);
    });

    // Build table body
    const tbody = this.createTBody();
    data.forEach((item, rowIndex) => {
        const row = tbody.insertRow();
        row.classList.add('xtable-body-row');
        cols.forEach(col => {
            const cell = row.insertCell();
            cell.classList.add('xtable-body-cell');
            cell.textContent = item[col.data];
            if (col.index) {
                row.setAttribute('d-index', item[col.data]);
            }
        });

        // Add click event listener to row
        row.addEventListener('click', () => {
            const dIndexValue = row.getAttribute('d-index');
            const event = new CustomEvent('XTABLE.EVENT:ROW_CLICK', {
                detail: {
                    key: dIndexValue
                }
            });
            this.dispatchEvent(event);
        });
    });

    // Initialize pagination and sortable columns
    this.paginate(pageLength); // Set the maximum number of rows per page to 10
    this.makeColumnsSortable(cols);
};

HTMLTableElement.prototype.sortRows = function(columnIndex, ascending = true, dataType = 'text') {
    const rows = Array.from(this.tbody ? this.tbody.rows : []);
    const filteredRows = rows.filter(row => row.dataset.matches !== 'false');
    filteredRows.sort((a, b) => {
        let aText = a.cells[columnIndex].textContent.trim();
        let bText = b.cells[columnIndex].textContent.trim();

        if (dataType === 'number') {
            aText = parseFloat(aText);
            bText = parseFloat(bText);
            return ascending ? aText - bText : bText - aText;
        } else {
            return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });

    filteredRows.forEach(row => this.tbody.appendChild(row));
};

HTMLTableElement.prototype.makeColumnsSortable = function(cols) {
    const headers = this.thead ? this.thead.rows[0].cells : [];
    Array.from(headers).forEach((header, index) => {
        if (cols[index].sortable) {
            let ascending = true;
            header.style.cursor = 'pointer';
            header.classList.add('xtable-head-sortable');
            header.addEventListener('click', () => {
                this.sortRows(index, ascending, cols[index].data_type);
                ascending = !ascending; // Toggle sorting order
            });
        }
    });
};