const express = require('express');
const app = express();

app.use(express.json());

let phonebook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'    
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-234345'   
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'   
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-64-23122'   
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
});

app.get('/api/info', (request, response) => {
    const totalPeople = phonebook.length;
    const totalPeopleText = `Phonebook has info for ${totalPeople} people`;
    let date = new Date();
    response.send(`<p>${totalPeopleText} <br> <br> ${date} </p>`);
});

app.get('/api/persons/:id', (request, response) => {
    const id= Number(request.params.id);

    const personId = phonebook.find(person => person.id === id);

    return personId ? response.json(personId) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id= Number(request.params.id);
    phonebook = phonebook.filter(person => person.id !== id);
    response.status(204).end()
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})