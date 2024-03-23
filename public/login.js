function ready(){
    const formTag = document.querySelector('.form')
    const pTag = document.createElement('p')
    pTag.classList.add('error-para')
    var lgBtn = document.getElementsByClassName('btn')[0]
    var frgtBtn = document.getElementsByClassName('forget-pass')[0]
    var emailTag = document.querySelector('input[name="email"]')
    var passwordTag = document.querySelector('input[name="password"]')
    lgBtn.addEventListener('click',function(event){
        event.preventDefault()
        try {
            var email = emailTag.value
            var password = passwordTag.value
            
            if(!email.trim() || !password.trim()){
                pTag.classList.add('error')
                pTag.innerText = 'Please provide all values'
                formTag.insertBefore(pTag,lgBtn)

                return
            }
        } catch (error) {
            pTag.classList.add('error')
            pTag.innerText = 'Please provide all values'
            formTag.insertBefore(pTag,lgBtn)
            return
        }
        logUser(email,password)
    })
    frgtBtn.addEventListener('click',async function(event){
        console.log("INcoming");
        event.preventDefault()
        if(!emailTag.value.trim()){
        console.log("Yeah here");
            pTag.classList.add('error')
            pTag.innerText = 'Please provide email to send reset link'
            formTag.insertBefore(pTag,lgBtn)
            return
        }
        else{
            localStorage.setItem('email',emailTag.value)
        }
        try {
            const response = await axios.post('/api/v1/auth/forget-pwd',{email:emailTag.value})
            pTag.classList.add('success')
            pTag.innerText = 'Check your email for password resetting link'
          
            formTag.insertBefore(pTag,lgBtn)
            
        } catch (error) {
            const msg = error.response.data.msg
            pTag.classList.add('error')
            pTag.innerText = msg
            formTag.insertBefore(pTag,lgBtn)
        }
        
        return
    })

     async function logUser(email,password){
        let response;
        try {
            response = await axios.post('/api/v1/auth/login',
            {
                email,
                password
            })
            const token = response.data.token
            const msg = response.data.msg
            localStorage.setItem('email',email)
            localStorage.setItem('token',token)
            pTag.classList.add('success')
            pTag.innerText = msg
            formTag.insertBefore(pTag,lgBtn)

            window.location.href='main.html'
        } catch (error) {
            const msg = error.response.data.msg;
            pTag.classList.add('error')
            pTag.innerText = msg
            formTag.insertBefore(pTag,lgBtn)
        }
     } 
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
