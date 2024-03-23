function ready(){
    window.onload = setValue()
    const SaveBtn = document.querySelector('.save')
    const SaveBtnparent = SaveBtn.parentElement
    const TaskWrapper = SaveBtnparent.parentElement
    var BackBtn = document.querySelector('.back')
    var errorPara = document.createElement('p')
    errorPara.classList.add('errorpara')
    SaveBtn.addEventListener('click',function(event){
        event.preventDefault()
        var name,completed
        var nameTag = document.querySelector('input[name="task"]')
        var Selected = document.querySelector('input[name="completed"]:checked')
        try {
            name= nameTag.value
            completed = Selected.value 
            
            if(!name.trim()){
        errorPara.classList.remove('success')
                errorPara.classList.add('error')
                errorPara.innerText = 'Please provide name'
                TaskWrapper.insertBefore(errorPara,SaveBtnparent)
                errorPara.classList.remove('errorpara')
                return
            }
        } catch (error) {
        errorPara.classList.remove('success')
            errorPara.classList.add('error')
            errorPara.innerText = 'Please provide all values'
            TaskWrapper.insertBefore(errorPara,SaveBtnparent)
            errorPara.classList.remove('errorpara')
            return
        }
        saveTask({name,completed})
        
        
    })
    BackBtn.addEventListener('click',function(event){
        localStorage.removeItem('taskId')
        localStorage.removeItem('taskName')
        localStorage.removeItem('taskCompleted')
        window.location.href = 'main.html'
    })

    function setValue(){
       const idTag = document.querySelector('.taskid')
       const nameTag = document.querySelector('input[name="task"]')
       const completedTag = document.querySelectorAll('input[name="completed"]')
       idTag.innerText = localStorage.getItem('taskId')
       nameTag.value = localStorage.getItem('taskName')
       const value = localStorage.getItem('taskCompleted').split(' ')[0] ;
      (value === 'none')?completedTag[1].checked = true:completedTag[0].checked =true
   }

   async function saveTask({name,completed}){
    try{
        const response = await axios.patch(`/api/v1/tasks/${localStorage.getItem('taskId')}`,{name,completed},
        {
           headers:{
               Authorization:`Bearer ${localStorage.getItem('token')}`
           }
        })
   
        errorPara.innerText = response.data.msg
        errorPara.classList.remove('error')
        errorPara.classList.add('success')
        TaskWrapper.insertBefore(errorPara,SaveBtnparent)
    }
    catch(error){
        errorPara.innerText = error.response.data.msg
        errorPara.classList.remove('success')
        errorPara.classList.add('error')
        TaskWrapper.insertBefore(errorPara,SaveBtnparent)
    }
   }
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}