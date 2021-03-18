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
];

const generateRandomPersonsID = () => {
    let random;
    const p = phonebook.map(p => p.id);
    
    // Generate a random ID that does not exist in the current phonebook
    do {
        random = Math.floor(Math.random() * 10) + 1;
    } while(p.includes(random));

    return random
}

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
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const isSameName = phonebook.find(person => person.name.includes(body.name));

    if (!body.name) {
        return response.status(400).json({ 
        error: 'name is missing' 
        })
    }

    if(!body.number) {
        return response.status(400).json({ 
            error: 'number is missing' 
        })
    }

    if(isSameName) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const newPerson = {
        id: generateRandomPersonsID(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(newPerson);
    response.json(newPerson);
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})