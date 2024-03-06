let projects = []
let tasks = []
LoadData()
// ---SETUP---
function LoadData(){
    //loadTasks()
    loadProjects()

    const task = {
        name: "Návrch šablony",
        projectId: "1",
        start: new Date(new Date - 100000),
        end: new Date()
    };

    const project = {
        id: "1",
        name: "Projekt 1"
    }
    const project2 = { id: "2", name: "Projekt 2"}

    projects.push(project)
    projects.push(project2)
    tasks.push(task)

    const cProject = document.querySelector('#currentProject')
    projects.forEach(p => {
        const x = document.createElement('option')
        x.setAttribute('value', p.id)
        x.innerText = p.name
        cProject.appendChild(x)
    })

    renderProjects()
    renderTasks()
}
//-----------------------HEADER--------------------------------------
const cForm = document.querySelector('#currentForm')
const cBtn = document.querySelector('#btnStartStop')
const cInput = document.querySelector('#currentText')
const cProject = document.querySelector('#currentProject')
let started = false;
let currentTask;
let cInterval;
const cHead = document.querySelector('#clockH')
cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!started){
        started = true;
        cBtn.classList.remove('circle')
        currentTask = {
            name: cInput.value,
            projectId: cProject.value,
            start: new Date(),
            end: null
        };

        cInterval = setInterval(() => {
            currentTask.end =  new Date(new Date - currentTask.start)
            cHead.innerText = currentTask.end.getUTCHours().toString().padStart(2, '0')+':'+currentTask.end.getMinutes().toString().padStart(2, '0')+':'+currentTask.end.getSeconds().toString().padStart(2, '0')
        }, 100)
    }else{ //STOP
        started = false;
        clearInterval(cInterval)
        cHead.innerText = "00:00:00"
        currentTask.end = new Date()

        cBtn.classList.add('circle')
        tasks.push(currentTask)
        renderTasks();
        saveTasks();


    }
})

//-----------------------------TASK--------------------------------------
function renderTasks() {
    document.querySelectorAll('#taskTable *').forEach(e => e.remove());

    tasks.forEach((c, index) => {
        const area = document.querySelector("#taskTable")
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        const th3 = document.createElement('th');
        const sp1 = document.createElement('div');
        const sp2 = document.createElement('div');
        const th4 = document.createElement('th');
        const sp3 = document.createElement('div');
        const sp4 = document.createElement('div');
        const th5 = document.createElement('th');
        const th6 = document.createElement('th');
        const btnDel = document.createElement('button');

        th1.innerText = c.name
        th2.innerText = projects.find(p => p.id === c.projectId).name
        sp1.innerText = c.start.toLocaleDateString()
        sp2.innerText = c.start.getHours().toString().padStart(2, '0')+':'+c.start.getMinutes().toString().padStart(2, '0')
        if (c.end != null){
            sp3.innerText = c.end.toLocaleDateString()
            sp4.innerText = c.end.getHours().toString().padStart(2, '0')+':'+c.end.getMinutes().toString().padStart(2, '0')
            const diff = new Date(c.end - c.start)
            console.log(c.start)
            console.log(c.end)
            console.log(diff)
            th5.innerText = diff.getUTCHours().toString().padStart(2, '0')+':'+diff.getUTCMinutes().toString().padStart(2, '0')+':'+diff.getUTCSeconds().toString().padStart(2, '0')
        }
        btnDel.innerText = "smazat"
        btnDel.addEventListener('click', (e) => {
            tasks.splice(index,1)
            renderTasks()
            saveTasks() //delete in cash
        })

        tr.appendChild(th1)
        tr.appendChild(th2)
        tr.appendChild(th3)
        tr.appendChild(th4)
        tr.appendChild(th5)
        tr.appendChild(th6)
        th3.appendChild(sp1)
        th3.appendChild(sp2)
        th4.appendChild(sp3)
        th4.appendChild(sp4)
        th6.appendChild(btnDel)
        area.appendChild(tr)
    });
}
function saveTasks() {
    const Json = JSON.stringify(tasks);
    localStorage.setItem('tasks', Json);
}
function loadTasks() {
    const Json = localStorage.getItem('tasks');
    if (!Json) {
        tasks = [];
        return;
    }
    tasks = JSON.parse(Json);
    renderTasks();
}

//--------------PROJECTS-------------------------------------

const dialogProjectEdit = document.querySelector('#dialogEditTaskProject');
const formProjectEdit = dialogProjectEdit.querySelector('form')
const inputProjectEdit = dialogProjectEdit.querySelector('input')
let editSender = null; //change
formProjectEdit.addEventListener('submit', (e) => {
    e.preventDefault()
    projects[editSender].name = inputProjectEdit.value
    //renderProjects() //JS => není třeba refresh
})
const dialogProjectCreate = document.querySelector('#dialogNewTaskProject');
const formProjectCreate = dialogProjectCreate.querySelector('form')
const inputProjectCreate = dialogProjectCreate.querySelector('input')
formProjectCreate.addEventListener('submit', (e) => {
    e.preventDefault()
    let id = 1
    if (projects[projects.length - 1].id){ id = parseInt(projects[projects.length - 1].id) + 1}
    const project = {
        id: id,
        name: inputProjectCreate.value
    }
    projects.push(project)
    renderProjects()
    saveProjects()
    dialogProjectCreate.Close()
    console.log(project)
})
function renderProjects() {
    document.querySelectorAll('#projectTable *').forEach(e => e.remove());

    projects.forEach((c, index) => { //index is cool
        const area = document.querySelector("#projectTable")
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        const th3 = document.createElement('th');
        const btnDel = document.createElement('button');
        const btnEdit = document.createElement('button');

        let total = 0
        const p = tasks.filter(t => t.projectId === c.id)
        p.forEach(t => {
            let diff = t.end.getTime() - t.start.getTime();
            total += diff;
        })
        let t = new Date(total)

        th1.innerText = c.name
        th2.innerText = t.getUTCHours().toString().padStart(2, '0')+':'+t.getUTCMinutes().toString().padStart(2, '0')+':'+t.getUTCSeconds().toString().padStart(2, '0')
        btnDel.innerText = "smazat"
        btnEdit.innerText = "upravit"
        btnDel.addEventListener('click', (e) => {
            projects.splice(index,1)
            renderProjects()
            saveProjects()
        })
        btnEdit.addEventListener('click', (e) => {
            editSender = c.id;
            dialogProjectEdit.showModal()
        })

        tr.appendChild(th1)
        tr.appendChild(th2)
        tr.appendChild(th3)
        th3.appendChild(btnEdit)
        th3.appendChild(btnDel)
        area.appendChild(tr)
    });
}
function saveProjects() {
    const projectsJson = JSON.stringify(projects);
    localStorage.setItem('projects', projectsJson);
}
function loadProjects() {
    const Json = localStorage.getItem('projects');
    if (!Json) {
        projects = [];
        return;
    }
    projects = JSON.parse(Json);
    renderProjects();
}

// --- OPEN DIALOG ---
const btnTask = document.querySelector('#btnTask');
const dialogTask = document.querySelector('#dialogNewTask');
btnTask.addEventListener('click', (e) => {
    dialogTask.showModal()
})
const btnProject = document.querySelector('#btnProject');
const dialogProject = document.querySelector('#dialogNewTaskProject');
btnProject.addEventListener('click', (e) => {
    dialogProject.showModal()
})
// dialogProject.addEventListener('submit', (e) => {
//     e.preventDefault()
//     projects[editSender].name = inputProjectEdit.value
// })
