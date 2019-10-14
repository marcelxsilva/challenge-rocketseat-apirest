const express = require('express');
const server = express();
server.use(express.json());

/*
Routes
    - POST: /projects : route to add new project
        - receiver - id and title
        - format object: { id: "1", title: 'new project', tasks: [] }

    - GET /projects: route to get all projects and tasks

    - PUT /projects/:id : should alter just title from projects

    - DELETE /projects/:id : should remove project

    - POST /projects/:id/tasks - should add new task in project

 Middleware
    - verifyProjectExists: Verify is project exists per id
    - countRequisition: count amount of requisitions

*/
let countRequisitionAmount = 0;
let projects = [{ id: 1, title: 'new project', tasks: [] }];

function verifyProjectExists(req, res, next) {
    const { id } = req.params;
    const response = projects.find(project => project.id == id);
    if (!response) {
        return res.status(200).json({ error: 'Project not exists' });
    }
    next();
}

function countRequisition(req, res, next) {
    countRequisitionAmount++;
    console.log(`Requisitions: ${countRequisitionAmount}`);
    next();
}

// route to add new project
server.post('/projects', countRequisition, (req, res) => {
    const { title } = req.body;
    projects.push({ title, id: projects.length + 1, tasks: [] });
    return res.json({ projects });
});

// rooute to get all projects
server.get('/projects', (req, res) => {
    return res.json({ projects })
});

// route to update title project
server.put('/projects/:id', verifyProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(item => item.id == id);
    project.title = title;
    return res.json({ project });
});

// route to delete project 
server.delete('/projects/:id', verifyProjectExists, (req, res) => {
    const { id } = req.params;
    const project = projects.findIndex(item => item.id == id);
    projects.splice(project, 1);
    return res.send({ projects });
});

// route to add tasks
server.post('/projects/:id/tasks', verifyProjectExists, (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    const project = projects.find(item => item.id == id);
    project.tasks.push(task);
    return res.json({ project });
});

server.listen(3001);