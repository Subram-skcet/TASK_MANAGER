function ready() {
    var tasksList = document.querySelector('.tasks');
    let tasks;
    const errorPara = document.createElement('p')
    errorPara.classList.add('error-para')

    window.onload = getTasks()
    window.addEventListener('pageshow',function(event){
            if(event.persisted){
                getTasks()
            }
    })
    window.addEventListener('pagehide',function(event){
        if(event.persisted){
            tasksList.innerHTML=''
        }
})
    tasksList.addEventListener('click', function(event) {
        const taskElem = event.target.closest('.task');
        if (!taskElem) return; 
    
        const victimTask = taskElem.querySelector('p');

        
        if (event.target.classList.contains('remove')) {
            deleteTask(victimTask.id); 
            taskElem.remove();
        }
        else if(event.target.classList.contains('edit')){
            localStorage.setItem('taskId',victimTask.id)
            localStorage.setItem('taskName',victimTask.innerHTML)
            localStorage.setItem('taskCompleted', getComputedStyle(victimTask).textDecoration);
        }
    });
    
    var addTask = document.querySelector('.add');
    addTask.addEventListener('click', function(event) {
        event.preventDefault();
        var taskInput = document.querySelector('input[name="task"]');
        var taskName = taskInput.value;
        if(!taskName || !taskName.trim()){
           
            errorPara.classList.add('error')
            errorPara.innerText = 'Error adding task'
            let midWrappper = document.querySelector('.mid-wrapper')
            midWrappper.insertBefore(errorPara,tasksList)
            return;
        }
        addTaskToList(taskName);
        taskInput.value = '';
    });

    async function addTaskToList(name) {
        const response = await axios.post('/api/v1/tasks',{"name":`${name}`},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        const task = response.data.task
        displayList(task)
        
    }
    async function getTasks(){
        try{
            const response = await axios.get('/api/v1/tasks',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            tasks = response.data.tasks
            const count = response.data.count
            if(count == 0 || !tasks){
                errorPara.classList.add('notask')
                errorPara.innerText = 'No tasks to display,Try adding new tasks'
                let midWrappper = document.querySelector('.mid-wrapper')
                midWrappper.insertBefore(errorPara,tasksList)
                errorPara.classList.remove('notask')
            }
            else{
                tasks.map((task)=>{
                    displayList(task)
                })
            }
        }
        catch(error){
            errorPara.classList.add('notask')
            errorPara.innerText = 'Error displaying in tasks'
        }
    }
    async function deleteTask(id){
        try {
            const msg = await axios.delete(`/api/v1/tasks/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
        } catch (error) {
        }
    }
    function displayList(task) {
        var taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.innerHTML = `
            <p style="text-decoration:${task.completed?'line-through':'none'};" id="${task._id}">${task.name}</p>
            <div class="icons">
                        <span class="material-symbols-outlined remove">delete</span>
                     <a href="edit.html">
                            <span class="material-symbols-outlined edit">edit</span>
                    </a>
            </div>
        `;
        tasksList.appendChild(taskDiv);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
