document.addEventListener('DOMContentLoaded', () => {
    const addPersonBtn = document.getElementById('addPersonBtn');
    const searchPersonBtn = document.getElementById('searchPersonBtn');
    const listPeopleBtn = document.getElementById('listPeopleBtn');
    const addPersonSection = document.getElementById('addPersonSection');
    const searchPersonSection = document.getElementById('searchPersonSection');
    const listPeopleSection = document.getElementById('listPeopleSection');
    const addPersonForm = document.getElementById('addPersonForm');
    const addPersonMessage = document.getElementById('addPersonMessage');
    const searchPersonForm = document.getElementById('searchPersonForm');
    const searchType = document.getElementById('searchType');
    const searchValue = document.getElementById('searchValue');
    const searchResultsBody = document.getElementById('searchResultsBody');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const loadListBtn = document.getElementById('loadListBtn');
    const peopleListBody = document.getElementById('peopleListBody');
    const emptyListMessage = document.getElementById('emptyListMessage');
    /**
     * Guarda la lista de personas en localStorage.
     * @param {Array} people - La lista de personas a guardar.
     */
    const savePeople = (people) => {
        localStorage.setItem('agendaPeople', JSON.stringify(people));
    };
    /**
     * Carga la lista de personas desde localStorage.
     * @returns {Array} La lista de personas, o un array vacío si no hay datos.
     */
    const loadPeople = () => {
        const peopleJSON = localStorage.getItem('agendaPeople');
        return peopleJSON ? JSON.parse(peopleJSON) : [];
    };
    /**
     * Muestra la sección especificada y oculta las demás.
     * @param {HTMLElement} sectionToShow - La sección que se debe mostrar.
     */
    const showSection = (sectionToShow) => {
        addPersonSection.classList.add('hidden');
        searchPersonSection.classList.add('hidden');
        listPeopleSection.classList.add('hidden');
        sectionToShow.classList.remove('hidden');
        addPersonMessage.textContent = '';
        addPersonMessage.classList.remove('error');
        searchResultsBody.innerHTML = '';
        noResultsMessage.classList.add('hidden');
        peopleListBody.innerHTML = '';
        emptyListMessage.classList.add('hidden');
    };
    /**
     * Renderiza una fila de tabla con los datos de una persona.
     * @param {Object} person - El objeto persona.
     * @returns {string} El HTML de la fila de la tabla.
     */
    const renderPersonRow = (person) => `
        <tr>
            <td>${person.document}</td>
            <td>${person.names}</td>
            <td>${person.lastnames}</td>
            <td>${person.address}</td>
            <td>${person.phone}</td>
        </tr>
    `;
    addPersonBtn.addEventListener('click', () => showSection(addPersonSection));
    searchPersonBtn.addEventListener('click', () => showSection(searchPersonSection));
    listPeopleBtn.addEventListener('click', () => showSection(listPeopleSection));
    addPersonForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const document = event.target.document.value.trim();
        const names = event.target.names.value.trim();
        const lastnames = event.target.lastnames.value.trim();
        const address = event.target.address.value.trim();
        const phone = event.target.phone.value.trim();
        if (!document || !names || !lastnames || !address || !phone) {
            addPersonMessage.textContent = 'Todos los campos son obligatorios.';
            addPersonMessage.classList.add('error');
            return;
        }
        let people = loadPeople();
        if (people.some(person => person.document === document)) {
            addPersonMessage.textContent = 'Ya existe una persona con ese número de identificación.';
            addPersonMessage.classList.add('error');
            return;
        }
        const newPerson = { document, names, lastnames, address, phone };
        people.push(newPerson);
        savePeople(people);
        addPersonMessage.textContent = 'Persona registrada exitosamente.';
        addPersonMessage.classList.remove('error');
        addPersonForm.reset();
    });
    searchPersonForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const type = searchType.value;
        const value = searchValue.value.trim().toLowerCase(); 
        searchResultsBody.innerHTML = '';
        noResultsMessage.classList.add('hidden');
        if (!value) {
            searchResultsBody.innerHTML = '<tr><td colspan="5">Por favor, ingresa un valor para buscar.</td></tr>';
            return;
        }
        const people = loadPeople();
        const results = people.filter(person => {
            if (type === 'document') {
                return person.document.toLowerCase().includes(value);
            } else if (type === 'names') {
                return person.names.toLowerCase().includes(value);
            } else if (type === 'lastnames') {
                return person.lastnames.toLowerCase().includes(value);
            }
            return false;
        });
        if (results.length > 0) {
            results.forEach(person => {
                searchResultsBody.innerHTML += renderPersonRow(person);
            });
        } else {
            noResultsMessage.classList.remove('hidden');
        }
    });
    loadListBtn.addEventListener('click', () => {
        peopleListBody.innerHTML = '';
        emptyListMessage.classList.add('hidden');
        const people = loadPeople();
        if (people.length > 0) {
            people.forEach(person => {
                peopleListBody.innerHTML += renderPersonRow(person);
            });
        } else {
            emptyListMessage.classList.remove('hidden');
        }
    });
    showSection(addPersonSection);
});