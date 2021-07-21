const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// Usually will not log the body of a request as it is not safe , but doing this for exercise purposes
morgan.token('data', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : null;
});

// Middleware set-up
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(morgan((token, request, response) => {
    return [
        token.method(request, response),
        token.url(request, response),
        token.status(request, response),
        token.res(request, response, 'content-length'), '-',
        token['response-time'](request, response), 'ms',
        token.data(request, response)
    ].join(' ')
}));


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
    const existingPersonsID = phonebook.map(person => person.id);
    
    // Generate a random ID that does not exist in the current phonebook
    do {
        random = Math.floor(Math.random() * 10) + 1;
    } while(existingPersonsID.includes(random));

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
    const { id } = request.params
    const personId = phonebook.find(person => person.id === Number(id));

    return personId ? response.json(personId) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const { id }= request.params;
    phonebook = phonebook.filter(person => person.id !== Number(id));
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})