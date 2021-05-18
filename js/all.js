const inputs = document.querySelectorAll('.input-group input');
const navbarLogin=document.querySelector('.navbar-login')
const closeBtn=document.querySelector('.close')

// css
function focusfn() {
    const parent = this.parentNode;
    parent.classList.add('focus');
}
function blurfn() {
    const parent = this.parentNode;
    console.log(this)
    if (this.value === '') {
        parent.classList.remove('focus');
    }
}
function clearModal(){
    inputs.forEach(item=>{
        item.value=""
        item.parentNode.classList.remove('focus')
    })
    let errors = validate(form, constraints);
    console.log(errors)
        //呈現在畫面上
        if(errors){
        Object.keys(errors).forEach(function(keys) {
            document.querySelector(`.${keys}`).textContent = ""
        })
        }
}

inputs.forEach((item) => {
    item.addEventListener('focus', focusfn);
    item.addEventListener('blur', blurfn);
});

closeBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    closeBtn.parentNode.classList.add('d-none')
    clearModal()
})

navbarLogin.addEventListener('click',(e)=>{
    closeBtn.parentNode.classList.remove('d-none')
    
})

// validate
const constraints = {
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

};
const form = document.querySelector("form");
const loginBtn=document.querySelector('.loginBtn')

function validateFn(){
    let errors = validate(form, constraints);
        //呈現在畫面上
        if(errors){
        Object.keys(errors).forEach(function(keys) {
            document.querySelector(`.${keys}`).textContent = errors[keys]
        })
        }
}

inputs.forEach((item) => {
    item.addEventListener("change", function() {
        item.parentNode.nextElementSibling.textContent = "";
        validateFn()
    });
});


//week02 start
const logoutBtn=document.querySelector('.navbar-logout')
const checkBtn=document.querySelector('.navbar-logcheck')
const productlist=document.querySelector('.product-list')
const addBtn=document.querySelector('.navbar-addProduct')
const img=document.querySelector('.img')

const url = 'https://vue3-course-api.hexschool.io/'
const path = 'jason06286'
let productData=[]

init()

function init() {
    storgeToken(false)
}

loginBtn.addEventListener('click',login)
logoutBtn.addEventListener('click',logout)
checkBtn.addEventListener('click',checkLogin)
addBtn.addEventListener('click',addProduct)
productlist.addEventListener('click',delProduct)



function login() {
    validateFn()
    if(inputs[0].parentNode.nextElementSibling.textContent=== "" && inputs[1].parentNode.nextElementSibling.textContent=== ""){
        console.log('emailgood')
        axios({
            method: 'post',
            url: `${url}admin/signin`,
            data:{
                "username": inputs[0].value,
                "password": inputs[1].value
            }
        })
            .then(res => {
                console.log(res)
                logStatus(res.data.success)
                clearModal()
                alert(res.data.message)
                storgeToken(res.data)
            })
            .catch(err => {
                console.log(err.response)
            })
    }
    
}

function storgeToken(res) {
    if(res.success){
        const token=res.token
        const expired=res.expired
        console.log(token,expired)
        document.cookie=`hexToken=${token};expires=${new Date(expired)}`
        logStatus(res.success)
    }else{
        const token=""
        document.cookie=`hexToken=${token};expires=${new Date()}`
    }
}

function logStatus(suceess) {
    if(suceess){
        closeBtn.parentNode.classList.add('d-none')
        navbarLogin.classList.add('d-none')
        logoutBtn.classList.remove('d-none')
        getProduct()
        productlist.classList.remove('d-none')
        img.classList.add('d-none')
    }else{
        navbarLogin.classList.remove('d-none')
        logoutBtn.classList.add('d-none')
        closeBtn.parentNode.classList.remove('d-none')
        productlist.classList.add('d-none')
        img.classList.remove('d-none')
    }
}


function logout() {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    axios.defaults.headers.common.Authorization=cookieToken
    axios({
        method: 'post',
        url: `${url}logout`,
    })
        .then(res => {
            console.log(res)
            alert(res.data.message)
            logStatus(!res.data.success)
            storgeToken(!res.data.success)
        })
        .catch(err => {
            console.log(err.response)
        })
}

function checkLogin() {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    axios.defaults.headers.common.Authorization=cookieToken
    axios({
        method: 'post',
        url: `${url}api/user/check`,
    })
        .then(res => {
            console.log(res)
            alert(`登入${res.data.success?'成功':'失敗'}`)
            logStatus(res.data.success)
        })
        .catch(err => {
            console.log(err.response)
        })
}


function getProduct() {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    axios.defaults.headers.common.Authorization=cookieToken
    axios({
        method: 'get',
        url: `${url}api/${path}/admin/products`,
    }).then((res )=> {
            productData=res.data.products
            console.log(productData)
            render()
        })
        .catch(err => {
            console.log(err.response)
        })
}

function render() {
    let str=productData.map(item=>`
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
}


function delProduct(e) {
    if(e.target.value==="delete"){
        const id=e.target.dataset.id
        axios({
            method: 'delete',
            url: `${url}api/${path}/admin/product/${id}`,
        })
            .then(res => {
                console.log(res)
                alert(res.data.message)
                getProduct()
            })
            .catch(err => {
                console.log(err.response)
            })
    }
}

function addProduct() {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    axios.defaults.headers.common.Authorization=cookieToken
    axios({
        method: 'post',
        url: `${url}api/${path}/admin/product`,
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
            getProduct()
        })
        .catch(err => {
            console.log(err.response)
        })
}