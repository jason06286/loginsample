import productModal from "./productModal.js"
import delModal from "./delModal.js"
import pageBtn from "./pagination.js"

const app=Vue.createApp(
    {
        components:{
            productModal,
            delModal,
            pageBtn
        },
        data() {
            return {
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
                loginObj:{
                    username:'',
                    password:''
                },
                //week02 start
                url :'https://vue3-course-api.hexschool.io/',
                path :'jason06286',
                productData:[],
                isLogin:false,
                isLoginModalShow:true,
                errors:"",
                useMethod:'新增產品',
                temp:{
                    title: "", 
                    category: "",
                    origin_price:"",
                    price: "",
                    unit: "",
                    description: "",
                    content: "",
                    is_enabled: "",
                    imageUrl : "",
                    imagesUrl: [],
                },
                delItem:'',
                productModalDom:'',
                delModalDom:'',
                page:2,
                pagination:''
            }
        },
        methods: {
            // css
            clearModal(){
                const form = document.querySelector("form#myform");
                this.loginObj.username=''
                this.loginObj.password=''
                let errors = validate(form, this.constraints);
                console.log(errors)
                    //呈現在畫面上
                    if(errors){
                        this.errors=errors
                    Object.keys(errors).forEach(function(keys) {
                        document.querySelector(`.${keys}`).textContent = ""
                    })
                    }
            },
            // validation
            validateFn(e){
                const form = document.querySelector("form#myform");
                let errors = validate(form, this.constraints);
                document.querySelector('.username').textContent =""
                document.querySelector('.password').textContent =""
                this.errors=errors
                    //呈現在畫面上
                    if(errors){
                    Object.keys(errors).forEach(function(keys) {
                        document.querySelector(`.${keys}`).textContent = errors[keys]
                    })
                    }
            },
            //work start
            login() {
                this.validateFn()
                if(this.errors === undefined){
                    console.log('logingood')
                    axios({
                        method: 'post',
                        url: `${this.url}admin/signin`,
                        data:{
                            ...this.loginObj
                        }
                    })
                        .then(res => {
                            console.log(res)
                            alert(res.data.message)
                            this.isLoginModalShow=!res.data.success
                            if(res.data.success){
                                this.isLogin=res.data.success
                                this.clearModal()
                                this.storgeToken(res.data)
                            }else{
                                const label=document.querySelector('.input-group label')
                                label.click()
                            }
                        })
                        .catch(err => {
                            console.log(err.response)
                        })
                }
            },
            storgeToken(res) {
                if(res.success){
                    const { token,expired }=res
                    console.log(token,expired)
                    document.cookie=`hexToken=${token};expires=${new Date(expired)}`
                    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
                    axios.defaults.headers.common.Authorization=cookieToken
                    this.getProduct()
                }else{
                    document.cookie = 'hexToken=; expires=; path=/';
                    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
                    axios.defaults.headers.common.Authorization=cookieToken
                }
            },
            logout() {
                axios({
                    method: 'post',
                    url: `${this.url}logout`,
                })
                    .then(res => {
                        console.log(res)
                        alert(res.data.message)
                        if(res.data.success){
                            this.isLogin=!res.data.success
                            this.isLoginModalShow=res.data.success
                            this.storgeToken(!res.data.success)
                        }
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
                    url: `${this.url}api/user/check`,
                })
                    .then(res => {
                        console.log(res)
                        alert(`登入${res.data.success?'成功':'失敗'}`)
                        this.isLogin=res.data.success
                        this.isLoginModalShow=!res.data.success
                    })
                    .catch(err => {
                        console.log(err.response)
                    })
            },
            getProduct(page=this.page) {
                this.page=page
                axios({
                    method: 'get',
                    url: `${this.url}api/${this.path}/admin/products?page=${this.page}`,
                }).then((res )=> {
                        this.productData=res.data.products
                        this.pagination=res.data.pagination
                        console.log(res)
                        console.log(this.productData)
                        console.log('this.pagination :>> ', this.pagination);
                    })
                    .catch(err => {
                        console.log(err.response)
                    })
            },
            closeModal(){
                this.isLoginModalShow=false
                this.clearModal()
            },
            keyEvent(e){
                if(e.keyCode === 13){
                    this.login()
                }else if(e.keyCode === 27){
                    this.closeModal()
                }
            },
            
            productModalShow(item,e){
                const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
                if(e.target.dataset.status === "編輯產品" && cookieToken != ""){
                    this.useMethod="編輯產品"
                    this.temp=JSON.parse(JSON.stringify(item))
                    this.temp.imagesUrl=this.temp.imagesUrl??[]
                    console.log("編輯產品",this.temp)
                    this.productModalDom.show()
                }else if(e.target.dataset.status === "新增產品" && cookieToken != ""){
                    this.useMethod="新增產品"
                    this.temp={
                        title: "", 
                        category: "",
                        origin_price:"",
                        price: "",
                        unit: "",
                        description: "",
                        content: "",
                        is_enabled: "",
                        imageUrl : "",
                        imagesUrl: [],
                    },
                    console.log("新增產品",this.temp)
                    this.productModalDom.show()
                }else{
                    alert("驗證錯誤，請重新登入")
                    const label=document.querySelector('.input-group label')
                    label.click()
                }
            },
            delProductModal(item){
                this.delItem=item
                this.delModalDom.show()
            },
            addProductModalDom(dom){
                this.productModalDom=dom
            },
            addDelModalDom(dom){
                this.delModalDom=dom
            }
        },
        mounted() {
            this.storgeToken(false)
            console.log(this.delModalDom)
        },
    }
)

app.mount('#app')



















