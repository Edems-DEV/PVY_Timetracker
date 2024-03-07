let projects = []
let tasks = []
LoadData()
// ---SETUP---

function UpdateDropDown(e, list){
    list.forEach(p => {
        const x = document.createElement('option')
        x.setAttribute('value', p.id)
        x.innerText = p.name
        e.appendChild(x)
    })
}

function UpdateProjectDropdowns(){
    const ccProject = document.querySelector('#currentProject')
    const newTaskProjects = document.querySelector('#newTask_Projects')
    UpdateDropDown(ccProject, projects);
    UpdateDropDown(newTaskProjects, projects);
}
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

    UpdateProjectDropdowns()

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

        cBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" fill="currentColor" class="bi bi-stop" viewBox="0 0 16 16">
          <path d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5z"/>
        </svg>
        `
        cBtn.classList.add('running')
        cBtn.classList.remove('rounded-circle')

        cInterval = setInterval(() => {
            currentTask.end =  new Date(new Date - currentTask.start)
            cHead.innerText = currentTask.end.getUTCHours().toString().padStart(2, '0')+':'+currentTask.end.getMinutes().toString().padStart(2, '0')+':'+currentTask.end.getSeconds().toString().padStart(2, '0')
        }, 100)
    }else{ //STOP
        started = false;
        clearInterval(cInterval)
        cHead.innerText = "00:00:00"
        currentTask.end = new Date()

        tasks.push(currentTask)
        renderTasks();
        saveTasks();

        cBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
        </svg>
        `
        cBtn.classList.remove("running")
        cBtn.classList.add('rounded-circle')
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
        btnDel.classList.add("btn")
        btnDel.classList.add("btn-danger")

        th1.innerText = c.name
        th2.innerText = projects.find(p => p.id === c.projectId).name
        sp1.innerText = c.start.toLocaleDateString()
        sp2.innerText = c.start.getHours().toString().padStart(2, '0')+':'+c.start.getMinutes().toString().padStart(2, '0')
        if (c.end != null){
            sp3.innerText = c.end.toLocaleDateString()
            sp4.innerText = c.end.getHours().toString().padStart(2, '0')+':'+c.end.getMinutes().toString().padStart(2, '0')
            const diff = new Date(c.end - c.start)
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


const dialogTaskCreate = document.querySelector('#dialogNewTask');
const formTaskCreate = dialogTaskCreate.querySelector('form')
const projectTaskCreate = dialogTaskCreate.querySelector('.project')
const taskTaskCreate = dialogTaskCreate.querySelector('.task')
const dayTaskCreate = dialogTaskCreate.querySelector('.day')
const hStartTaskCreate = dialogTaskCreate.querySelector('.hStart')
const mStartTaskCreate = dialogTaskCreate.querySelector('.mStart')
const hEndTaskCreate = dialogTaskCreate.querySelector('.hEnd')
const mEndTaskCreate = dialogTaskCreate.querySelector('.mEnd')
function buildDate(dateI, h, n) {
    let dateInput = dateI.value;
    let hoursInput = parseInt(h.value);
    let minutesInput = parseInt(n.value);

    let date = new Date(dateInput);
    date.setHours(hoursInput);
    date.setMinutes(minutesInput);

    return date
}
formTaskCreate.addEventListener('submit', (e) => {
    e.preventDefault()

    const task = {
        name: taskTaskCreate.value,
        projectId: projectTaskCreate.value,
        start: buildDate(dayTaskCreate, hStartTaskCreate, mStartTaskCreate),
        end: buildDate(dayTaskCreate, hEndTaskCreate, mEndTaskCreate)
    };
    console.log(task)
    console.log(projectTaskCreate.value)
    tasks.push(task)
    renderTasks()
    saveTasks()
    //dialogTaskCreate.Close()
})
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
const btcCloseProjectEdit = document.querySelector('#dialogEditTaskProject .btn-close');
btcCloseProjectEdit.addEventListener('click', (e) => dialogProjectEdit.close())
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
    UpdateProjectDropdowns()
    renderProjects()
    saveProjects()
    //dialogProjectCreate.Close()
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
        btnDel.classList.add("btn")
        btnDel.classList.add("btn-danger")
        btnDel.classList.add("ms-3")
        btnEdit.classList.add("btn")
        btnEdit.classList.add("btn-success")

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
const btnCloseTask = document.querySelector('#dialogNewTask .btn-close');
btnTask.addEventListener('click', (e) => dialogTask.showModal() )
btnCloseTask.addEventListener('click', (e) => dialogTask.close())
const btnProject = document.querySelector('#btnProject');
const dialogProject = document.querySelector('#dialogNewTaskProject');
const btnCloseProject = document.querySelector('#dialogNewTaskProject .btn-close');
btnProject.addEventListener('click', (e) => dialogProject.showModal())
btnCloseProject.addEventListener('click', (e) => dialogProject.close())


// dialogProject.addEventListener('submit', (e) => {
//     e.preventDefault()
//     projects[editSender].name = inputProjectEdit.value
// })

const PageProject = document.querySelector('#pageProjekt');
const pageOverview = document.querySelector('#pageOverview');
const btnPageOverview = document.querySelector('#btnPageOverview');
const btnPageProject = document.querySelector('#btnPageProject');
btnPageOverview.addEventListener('click', (e) => {
    pageOverview.classList.remove("hide")
    btnPageOverview.classList.add("active")

    PageProject.classList.add("hide")
    btnPageProject.classList.remove("active")
})
btnPageProject.addEventListener('click', (e) => {
    PageProject.classList.remove("hide")
    btnPageProject.classList.add("active")

    pageOverview.classList.add("hide")
    btnPageOverview.classList.remove("active")
})
