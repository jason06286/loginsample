const inputs = document.querySelectorAll('.input-group input');
const navbarLogin=document.querySelector('.navbar-login')
const closeBtn=document.querySelector('.close')
const form = document.querySelector("form");
const loginBtn=document.querySelector('.loginBtn')
const logoutBtn=document.querySelector('.navbar-logout')
const checkBtn=document.querySelector('.navbar-logcheck')
const productlist=document.querySelector('.product-list')
const addBtn=document.querySelector('.navbar-addProduct')
const img=document.querySelector('.img')


const app={
    data:{
         // validate
        constraints : {
            username: {
            presence: {
                message: "是必填欄位"
            },
            email:{
                message:"需要符合 Email 格式"
            }
            },
            password: {
            presence: {
                message: "是必填欄位"
            },
            },
        },
        //week02 start
        url :'https://vue3-course-api.hexschool.io/',
        path :'jason06286',
        productData:[],
    },
    methods: {
        // css
    focusfn() {
        const parent = this.parentNode;
        parent.classList.add('focus');
    },
    blurfn() {
        const parent = this.parentNode;
        console.log(this)
        if (this.value === '') {
            parent.classList.remove('focus');
        }
    },
    clearModal(){
        inputs.forEach(item=>{
            item.value=""
            item.parentNode.classList.remove('focus')
        })
        let errors = validate(form, app.data.constraints);
        console.log(errors)
            //呈現在畫面上
            if(errors){
            Object.keys(errors).forEach(function(keys) {
                document.querySelector(`.${keys}`).textContent = ""
            })
            }
    },
    // validation
    validateFn(){
        let errors = validate(form, app.data.constraints);
            //呈現在畫面上
            if(errors){
            Object.keys(errors).forEach(function(keys) {
                document.querySelector(`.${keys}`).textContent = errors[keys]
            })
            }
    },
    //week02 start
    init() {
        this.storgeToken(false)
    },
    login() {
        console.log(this)
        this.validateFn()
        if(inputs[0].parentNode.nextElementSibling.textContent=== "" && inputs[1].parentNode.nextElementSibling.textContent=== ""){
            console.log('emailgood')
            axios({
                method: 'post',
                url: `${app.data.url}admin/signin`,
                data:{
                    "username": inputs[0].value,
                    "password": inputs[1].value
                }
            })
                .then(res => {
                    console.log(res)
                    this.logStatus(res.data.success)
                    this.clearModal()
                    alert(res.data.message)
                    this.storgeToken(res.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        }
    },
    storgeToken(res) {
        if(res.success){
            const token=res.token
            const expired=res.expired
            console.log(token,expired)
            document.cookie=`hexToken=${token};expires=${new Date(expired)}`
            this.logStatus(res.success)
        }else{
            const token=""
            document.cookie=`hexToken=${token};expires=${new Date()}`
        }
    },
    logStatus(suceess) {
        if(suceess){
            closeBtn.parentNode.classList.add('d-none')
            navbarLogin.classList.add('d-none')
            logoutBtn.classList.remove('d-none')
            this.getProduct()
            productlist.classList.remove('d-none')
            img.classList.add('d-none')
        }else{
            navbarLogin.classList.remove('d-none')
            logoutBtn.classList.add('d-none')
            closeBtn.parentNode.classList.remove('d-none')
            productlist.classList.add('d-none')
            img.classList.remove('d-none')
        }
    },
    logout() {
        const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        axios.defaults.headers.common.Authorization=cookieToken
        axios({
            method: 'post',
            url: `${app.data.url}logout`,
        })
            .then(res => {
                console.log(res)
                alert(res.data.message)
                this.logStatus(!res.data.success)
                this.storgeToken(!res.data.success)
            })
            .catch(err => {
                console.log(err.response)
            })
    },
    checkLogin() {
        const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        axios.defaults.headers.common.Authorization=cookieToken
        axios({
            method: 'post',
            url: `${app.data.url}api/user/check`,
        })
            .then(res => {
                console.log(res)
                alert(`登入${res.data.success?'成功':'失敗'}`)
                this.logStatus(res.data.success)
            })
            .catch(err => {
                console.log(err.response)
            })
    },
    getProduct() {
        const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        axios.defaults.headers.common.Authorization=cookieToken
        axios({
            method: 'get',
            url: `${app.data.url}api/${app.data.path}/admin/products`,
        }).then((res )=> {
                app.data.productData=res.data.products
                console.log(app.data.productData)
                this.render()
            })
            .catch(err => {
                console.log(err.response)
            })
    },
    render() {
        let str=app.data.productData.map(item=>`
        <li class="card" >
                <img src=${item.imageUrl} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <button type="button" class="btn danger" data-id="${item.id}" value="delete">刪除商品</button>
                </div>
        </li>
        `).join('')
        productlist.innerHTML=str
    },
    delProduct(e) {
        if(e.target.value==="delete"){
            const id=e.target.dataset.id
            axios({
                method: 'delete',
                url: `${app.data.url}api/${app.data.path}/admin/product/${id}`,
            })
                .then(res => {
                    console.log(res)
                    alert(res.data.message)
                    this.getProduct()
                })
                .catch(err => {
                    console.log(err.response)
                })
        }
    },
    addProduct() {
        const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        axios.defaults.headers.common.Authorization=cookieToken
        axios({
            method: 'post',
            url: `${app.data.url}api/${app.data.path}/admin/product`,
            data:{
                data:{
                    "title": "[賣]動物園造型衣服3", 
                    "category": "衣服2",
                    "origin_price": 100,
                    "price": 300,
                    "unit": "個",
                    "description": "Sit down please 名設計師設計",
                    "content": "這是內容",
                    "is_enabled": 1,
                    "imageUrl" : "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                    "imagesUrl": [
                        "圖片網址一",
                        "圖片網址二",
                        "圖片網址三",
                        "圖片網址四",
                        "圖片網址五"
                    ]
                }
            }
        })
            .then(res => {
                console.log(res)
                alert(res.data.message)
                this.getProduct()
            })
            .catch(err => {
                console.log(err.response)
            })
    },
    },
}


inputs.forEach((item) => {
    console.log(this)
    item.addEventListener('focus',app.methods.focusfn);
    item.addEventListener('blur', app.methods.blurfn);
});

closeBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    closeBtn.parentNode.classList.add('d-none')
    app.methods.clearModal()
})

navbarLogin.addEventListener('click',(e)=>{
    closeBtn.parentNode.classList.remove('d-none')
    
})

inputs.forEach((item) => {
    item.addEventListener("change", (e) =>{
        item.parentNode.nextElementSibling.textContent = "";
        app.methods.validateFn()
    });
});

loginBtn.addEventListener('click',(e)=>{app.methods.login()})
logoutBtn.addEventListener('click',(e)=>{app.methods.logout()})
checkBtn.addEventListener('click',(e)=>{app.methods.checkLogin()})
addBtn.addEventListener('click',(e)=>{app.methods.addProduct()})
productlist.addEventListener('click',(e)=>{app.methods.delProduct(e)})


app.methods.init()
























