const app=Vue.createApp(
    {
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
                productModal:'',
                delModal:'',

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
            getProduct() {
                axios({
                    method: 'get',
                    url: `${this.url}api/${this.path}/admin/products`,
                }).then((res )=> {
                        this.productData=res.data.products
                        console.log(res)
                        console.log(this.productData)
                    })
                    .catch(err => {
                        console.log(err.response)
                    })
            },
            delProduct() {
                    axios({
                        method: 'delete',
                        url: `${this.url}api/${this.path}/admin/product/${this.delItem.id}`,
                    })
                        .then(res => {
                            console.log(res)
                            alert(res.data.message)
                            if(res.data.success){
                                this.delModal.hide()
                                this.getProduct()
                            }
                        })
                        .catch(err => {
                            console.log(err.response)
                        })
            },
            ProductStatus() {
                if(this.useMethod === '新增產品'){
                    axios({
                        method: 'post',
                        url: `${this.url}api/${this.path}/admin/product`,
                        data:{
                            data:{
                                ...this.temp,
                                is_enabled: parseInt(this.temp.is_enabled),
                            }
                        }
                    })
                        .then(res => {
                            console.log(res)
                            alert(res.data.message)
                            if(res.data.success){
                                this.productModal.hide()
                                this.getProduct()
                            }
                        })
                        .catch(err => {
                            console.log(err.response)
                        })
                }
                if(this.useMethod === '編輯產品'){
                    axios({
                        method: 'put',
                        url: `${this.url}api/${this.path}/admin/product/${this.temp.id}`,
                        data:{
                            data:{
                                ...this.temp,
                                is_enabled: parseInt(this.temp.is_enabled),
                            }
                        }
                    })
                        .then(res => {
                            console.log(res)
                            alert(res.data.message)
                            if(res.data.success){
                                this.productModal.hide()
                                this.getProduct()
                            }
                        })
                        .catch(err => {
                            console.log(err.response)
                        })
                }
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
            addImage(){
                this.temp.imagesUrl.push(this.temp.imageUrl)
                this.temp.imageUrl=""
            },
            delImage(){
                this.temp.imagesUrl.pop()
            },
            productModalShow(item,e){
                const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
                console.log(cookieToken)
                if(e.target.dataset.status === "編輯產品" && cookieToken != ""){
                    this.useMethod="編輯產品"
                    this.temp=JSON.parse(JSON.stringify(item))
                    this.temp.imagesUrl=this.temp.imagesUrl??[]
                    this.productModal.show()
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
                    this.productModal.show()
                }else{
                    alert("驗證錯誤，請重新登入")
                    const label=document.querySelector('.input-group label')
                    label.click()
                }
            },
            delProductModal(item){
                this.delItem=item
                this.delModal.show()
            }
        },
        mounted() {
            this.storgeToken(false)
            this.productModal = new bootstrap.Modal(document.querySelector('#productModal'))
            this.delModal = new bootstrap.Modal(document.querySelector('#delProductModal'))
        },
    }
)

app.mount('#app')



















