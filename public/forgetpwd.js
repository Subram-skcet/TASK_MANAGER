function ready(){
    var FormTag = document.querySelector('form')
    var pTag = document.createElement('p')
    pTag.classList.add('error-para')
    var saveBtn = document.getElementsByClassName('Save')[0]
    saveBtn.addEventListener('click',function(event){
        event.preventDefault()
        var pwdTag = document.querySelector('input[name="password"]')
        var cnfrmpwdTag = document.querySelector('input[name="cnfrmpassword"]')
        var pwd = pwdTag.value 
        var cfrmpwd = cnfrmpwdTag.value
        if(!pwd.trim() || !cfrmpwd.trim()){
            pTag.innerText = 'Please provide all values'
                FormTag.insertBefore(pTag,saveBtn)
                return
            }
            if(!(pwd === cfrmpwd)){
                pTag.innerText = "Password doesn't match"
                FormTag.insertBefore(pTag,saveBtn)
                return
            }
            else if(pwd === cfrmpwd){
              savePwd({pwd,cfrmpwd}) 
            }
    })
    async function savePwd({pwd:password,cfrmpwd:cnfrmpassword}){
        try {
            await axios.post('/api/v1/auth/update-pwd',{email:`${localStorage.getItem('email')}`,password,cnfrmpassword})
            pTag.classList.add('success')
                pTag.innerText = "Password saved successfully"
                FormTag.insertBefore(pTag,saveBtn)
            window.location.href = 'login.html'

        } catch (error) {
            const msg = error.response.data.msg;
            pTag.innerText = msg
            FormTag.insertBefore(pTag,saveBtn)
            
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
