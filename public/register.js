function ready(){
    const formTag = document.querySelector('.form')
    const pTag = document.createElement('p')
    pTag.classList.add('para')
     var regBtn = document.getElementsByClassName('btn')[0]
    regBtn.addEventListener('click',function(event){
        event.preventDefault()
        var nameTag = document.querySelector('input[name="name"]')
        var emailTag = document.querySelector('input[name="email"]')
        var passwordTag = document.querySelector('input[name="password"]')
        try {
            var name = nameTag.value 
            var email = emailTag.value
            var password = passwordTag.value
            
            if(!name.trim() || !email.trim() || !password.trim()){
                pTag.classList.remove('success')
                pTag.classList.add('error')
                pTag.innerText = 'Please provide all values'
                formTag.insertBefore(pTag,regBtn)
                return
            }
        } catch (error) {
            pTag.classList.remove('success')
            pTag.classList.add('error')
            pTag.innerText = 'Please provide all values'
            formTag.insertBefore(pTag,regBtn)
            return
        }
        register(name,email,password);
    })
    
    async function register(name,email,password){
        var msg,token;
            await axios.post('/api/v1/auth/register',{
                name:name,
                email:email,
                password:password
            })
            .then((response) =>{
                token = response.data.token
                msg = response.data.msg
                pTag.classList.remove('error')
                pTag.classList.add('success')
                pTag.innerText = msg
                formTag.insertBefore(pTag,regBtn)
                localStorage.setItem('name',name)
                localStorage.setItem('email',email)
                localStorage.setItem('token',token)
                 window.location.href='verifyemail.html'
            })
            .catch(error => {
                msg = error.response.data.msg;
                pTag.classList.remove('success')
                pTag.classList.add('error')
                pTag.innerText = msg
                formTag.insertBefore(pTag,regBtn)
                return;
            }
        )
        

    }
     
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
