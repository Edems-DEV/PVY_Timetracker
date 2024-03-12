let projects = []
let tasks = []
let editSender = null; //change
LoadData()
// ---SETUP---

function UpdateDropDown(e, list){
    e.querySelectorAll('*').forEach(e => e.remove());
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
    loadTasks()
    loadProjects()

    updateProjects()
    updateTasks()
}
function updateTasks(){
    renderTasks()
    renderTodayTime()
}
function updateProjects(){
    UpdateProjectDropdowns()
    renderProjects()
}
function updateSaveProjects(){
    updateProjects()
    saveProjects()
}

function makeValid(input, div){

    input.classList.remove('is-invalid')
    input.classList.add('is-valid');
    if (div !== null){
        div.classList.replace('text-danger', 'text-success');
        div.textContent = ""
    }
}
function makeClear(input){
    input.classList.remove('is-invalid')
    input.classList.remove('is-valid');
}
function makeInValid(input, div, msg = ""){
    input.classList.remove('is-valid');
    input.classList.add('is-invalid')
    if (div !== null){
        div.classList.replace('text-success', 'text-danger');
        div.textContent = msg
    }
}
function validate(e, isValid, msg){
    let x = null //e.nextElementSibling
    if (isValid){
        makeValid(e, x)
        return true
    }
    else{
        makeInValid(e, x, msg)
        return false
    }
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
function startTimer(){
    started = true;
    cBtn.classList.remove('circle')

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
}
cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!started){
        currentTask = {
            name: cInput.value,
            projectId: cProject.value,
            start: new Date(),
            end: null
        };
        startTimer();
    }else{ //STOP
        started = false;
        clearInterval(cInterval)
        cHead.innerText = "00:00:00"
        currentTask.end = new Date()
        currentTask.name = cInput.value
        currentTask.projectId = cProject.value

        tasks.push(currentTask)
        updateTasks();
        saveTasks();

        cBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
        </svg>
        `
        cBtn.classList.remove("running")
        cBtn.classList.add('rounded-circle')

        localStorage.removeItem('running')
        currentTask = null;
    }
})
function saveActiveTask() {
    let taskToSave2 = currentTask;
    taskToSave2.start = taskToSave2.start.getTime();
    taskToSave2.end = taskToSave2.end.getTime();

    const Json = JSON.stringify(taskToSave2);
    localStorage.setItem('running', Json);
}
function loadActiveTask() {
    const Json = localStorage.getItem('running');
    if (!Json) { return; }
    let tasksFromStorage = JSON.parse(Json);
    tasksFromStorage.start = new Date(tasksFromStorage.start)
    tasksFromStorage.end = new Date(tasksFromStorage.end)
    currentTask = tasksFromStorage
    updateTasks();
}
window.onload = function() {
    loadActiveTask();
    if (currentTask) {
        startTimer()
    }
    window.onbeforeunload = () => {
        if (currentTask == undefined || currentTask === null)
            return
        saveActiveTask()
    };
};

//-----------------------------TASK--------------------------------------
function  renderTodayTime(){
    const todayClock = document.querySelector('#clockToday');

    let totalTime = 0;
    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);
    tasks.filter(t => {
        const dateString = t.start.toISOString().slice(0, 10);
        return dateString === todayString;
    }).forEach(t => totalTime += t.end.getTime() - t.start.getTime())
    let total = new Date(totalTime);
    todayClock.innerHTML = total.getUTCHours().toString().padStart(2, '0')+':'+total.getUTCMinutes().toString().padStart(2, '0')+':'+total.getUTCSeconds().toString().padStart(2, '0')
}

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
        if (c.projectId != null && projects.length > 0 && projects != undefined){
            let final = ""
            let x = projects.find(p => p.id == c.projectId);
            if (x !== undefined) //deleted project
                final = x.name
            th2.innerText = final;
        }
        if (c.start != null){
            sp1.innerText = c.start.toLocaleDateString()
            sp2.innerText = c.start.getHours().toString().padStart(2, '0')+':'+c.start.getMinutes().toString().padStart(2, '0')
        }
        if (c.end != null){
            sp3.innerText = c.end.toLocaleDateString()
            sp4.innerText = c.end.getHours().toString().padStart(2, '0')+':'+c.end.getMinutes().toString().padStart(2, '0')
            const diff = new Date(c.end - c.start)
            th5.innerText = diff.getUTCHours().toString().padStart(2, '0')+':'+diff.getUTCMinutes().toString().padStart(2, '0')+':'+diff.getUTCSeconds().toString().padStart(2, '0')
        }
        btnDel.innerText = "smazat"
        btnDel.addEventListener('click', (e) => {
            //check if have task references (delete all child tasks?)
            tasks.splice(index,1)
            updateTasks()
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
    const tasksToSave = tasks.map(task => ({
        ...task,
        start: task.start.getTime(), // Convert to timestamp
        end: task.end.getTime() // Convert to timestamp
    }));

    const Json = JSON.stringify(tasksToSave);
    localStorage.setItem('tasks', Json);
}
function loadTasks() {
    const Json = localStorage.getItem('tasks');
    if (!Json) {
        tasks = [];
        return;
    }
    const tasksFromStorage = JSON.parse(Json);
    tasks = tasksFromStorage.map(task => ({
        ...task,
        start: new Date(task.start), // Convert timestamp to Date object
        end: new Date(task.end) // Convert timestamp to Date object
    }));
    updateTasks();
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
const totalTaskCreate = dialogTaskCreate.querySelector('.total')
function buildDate(dateI, h, n) {
    let dateInput = dateI.value;
    return buildDate2(dateInput, h,n)
}
function buildDate2(timeStemp, h, n) {
    //let dateInput = dateI.value;
    let hoursInput = parseInt(h.value);
    let minutesInput = parseInt(n.value);

    let date = new Date(timeStemp);
    date.setHours(hoursInput);
    date.setMinutes(minutesInput);

    return date
}
formTaskCreate.addEventListener('submit', (e) => {
    console.log(projectTaskCreate.value)
    if (
        !validate(taskTaskCreate, true, 'Required') ||
        !validate(projectTaskCreate, projectTaskCreate.value !== "", 'Required') ||
        !validate (dayTaskCreate   , dayTaskCreate.value !== "", 'Required') ||
        !isValid_TaskCreate()
    ) {
        e.preventDefault();
        return
    } else{ ClearNewTask() }
    const task = {
        name: taskTaskCreate.value,
        projectId: projectTaskCreate.value,
        start: buildDate(dayTaskCreate, hStartTaskCreate, mStartTaskCreate),
        end: buildDate(dayTaskCreate, hEndTaskCreate, mEndTaskCreate)
    };
    tasks.push(task)
    updateTasks()
    saveTasks()
    //dialogTaskCreate.Close()
})

function ClearNewTask(){
    makeClear(projectTaskCreate);
    makeClear(dayTaskCreate);
    makeClear(taskTaskCreate)
}

//check on submit = if empty: projectTaskCreate, dayTaskCreate
// taskTaskCreate.addEventListener('input', (e) => {
//     validate(taskTaskCreate, taskTaskCreate.value !== "", 'Required')
//     //is possible to make task without name
// })
let re = /^\d\d?$/;
function validateTimeInput(e, start,end){
    let isValid = false
    let diff = totalTaskCreate
    let diffError = diff.nextElementSibling
    if (hStartTaskCreate.value === '' ||
        mStartTaskCreate.value === '' ||
        hEndTaskCreate.value === '' ||
        mEndTaskCreate.value === '')
    {makeInValid(diff, diffError, 'Required')}
    else if (!re.test(e.value))
        makeInValid(diff, diffError, 'only numbers (2x)')
    else if (!isDiffValid())
        makeInValid(diff, diffError, 'Start > End')
    else{
        makeValid(diff, diffError)
        isValid = true;
    }
    return isValid;
}
function isDiffValid(){
    const c = {
        start: buildDate2('2024-03-12', hStartTaskCreate, mStartTaskCreate),
        end: buildDate2('2024-03-12', hEndTaskCreate, mEndTaskCreate)
    };
    return c.end.getTime() >= c.start.getTime();
}
hStartTaskCreate.addEventListener('input', (e) => {
    validateTimeInput(hStartTaskCreate, hStartTaskCreate, hEndTaskCreate)
})
mStartTaskCreate.addEventListener('input', (e) => {
    validateTimeInput(mStartTaskCreate, mStartTaskCreate, mEndTaskCreate)
})
hEndTaskCreate.addEventListener('input', (e) => {
    validateTimeInput(hEndTaskCreate, hStartTaskCreate, hEndTaskCreate)
})
mEndTaskCreate.addEventListener('input', (e) => {
    validateTimeInput(mEndTaskCreate, mStartTaskCreate, mEndTaskCreate)
})

function isValid_TaskCreate(){
    if      (hStartTaskCreate.value === ""){return false;}
    else if (mStartTaskCreate.value === ""){return false;}
    else if (hEndTaskCreate.value   === ""){return false;}
    else if (mEndTaskCreate.value   === ""){return false;}
    else {return true}
}
function updateTotalDiff(){
    if (isValid_TaskCreate()){
        const c = {
            start: buildDate2('2024-03-12', hStartTaskCreate, mStartTaskCreate),
            end: buildDate2('2024-03-12', hEndTaskCreate, mEndTaskCreate)
        };

        const diff = new Date(c.end - c.start)
        totalTaskCreate.innerText = diff.getUTCHours().toString().padStart(2, '0')+':'+diff.getUTCMinutes().toString().padStart(2, '0')+':'+diff.getUTCSeconds().toString().padStart(2, '0')
    }
}
//listing even when dialog is closed? => ERROR (still even withnout this)
hStartTaskCreate.addEventListener('input', updateTotalDiff)
mStartTaskCreate.addEventListener('input', updateTotalDiff)
hEndTaskCreate.addEventListener('input', updateTotalDiff)
mEndTaskCreate.addEventListener('input', updateTotalDiff)
//--------------PROJECTS-------------------------------------

const dialogProjectEdit = document.querySelector('#dialogEditTaskProject');
const formProjectEdit = dialogProjectEdit.querySelector('form')
const inputProjectEdit = dialogProjectEdit.querySelector('input')
inputProjectEdit.addEventListener('input', (e) => validate(inputProjectEdit, inputProjectEdit.value !== "", 'Required'))
formProjectEdit.addEventListener('submit', (e) => {
    if (!validate(inputProjectEdit, inputProjectEdit.value !== "", 'Required')) {
        e.preventDefault();
        return
    } else{  makeClear(inputProjectEdit) }
    projects[editSender].name = inputProjectEdit.value
    updateSaveProjects()
    updateTasks()
})
const btcCloseProjectEdit = document.querySelector('#dialogEditTaskProject .btn-close');
btcCloseProjectEdit.addEventListener('click', (e) => dialogProjectEdit.close())
const dialogProjectCreate = document.querySelector('#dialogNewTaskProject');
const formProjectCreate = dialogProjectCreate.querySelector('form')
const inputProjectCreate = dialogProjectCreate.querySelector('input')
inputProjectCreate.addEventListener('input', (e) => validate(inputProjectCreate, inputProjectCreate.value !== "", 'Required'))
formProjectCreate.addEventListener('submit', (e) => {
    if (!validate(inputProjectCreate, inputProjectCreate.value !== "", 'Required')) {
        e.preventDefault();
        return
    } else{  makeClear(inputProjectCreate) }
    let id = 1
    if(projects.length !== 0) {if (projects[projects.length - 1].id){ id = parseInt(projects[projects.length - 1].id) + 1}}
    const project = {
        id: id,
        name: inputProjectCreate.value
    }
    projects.push(project)
    updateSaveProjects()
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
            updateSaveProjects()
        })
        btnEdit.addEventListener('click', (e) => {
            editSender = index;
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
    updateProjects()
}

// --- OPEN DIALOG ---
const btnTask = document.querySelector('#btnTask');
const dialogTask = document.querySelector('#dialogNewTask');
const btnCloseTask = document.querySelector('#dialogNewTask .btn-close');
btnTask.addEventListener('click', (e) => {dialogTask.showModal(); updateTotalDiff()} )
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
