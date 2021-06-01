
export default {
    props:['temp','useMethod'],
    data() {
        return {
            url :'https://vue3-course-api.hexschool.io/',
            path :'jason06286',
            productModalDom:'',
        }
    },
    methods: {
        productStatus() {
            console.log('this.temp :>> ', this.temp);
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
                        console.log('res.data.success :>> ', res.data.success);
                        if(res.data.success){
                            this.productModalDom.hide()
                            console.log('456')
                            this.$emit('emitGetProduct')
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
                            console.log(this.productModalDOm)
                            this.productModalDom.hide()
                            this.$emit('emitGetProduct')
                        }
                    })
                    .catch(err => {
                        console.log(err.response)
                    })
            }
        },
        addImage(){
            this.temp.imagesUrl.push(this.temp.imageUrl)
            this.temp.imageUrl=""
        },
        delImage(){
            this.temp.imagesUrl.pop()
        },
    },
    template:` <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
<div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
    <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
        <span>{{useMethod}}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <div class="row">
        <div class="col-sm-4">
            <div class="mb-1">
                <div class="form-group">
                    <label for="imageUrl">輸入圖片網址</label>
                    <input type="text" class="form-control"
                            placeholder="請輸入圖片連結" v-model="temp.imageUrl">
                </div>
                <img class="img-fluid" :src="temp.imageUrl" alt="">
                </div>
                <div>
                <button class="btn btn-outline-primary btn-sm d-block w-100" type="button" @click="addImage">
                    新增圖片
                </button>
                </div>
                <div>
                <button class="btn btn-outline-danger btn-sm d-block w-100" type="button" @click="delImage">
                    刪除圖片
                </button>
                <img class="img-fluid" v-for="(item, index) in temp.imagesUrl" :key="item" :src="item" alt="">
            </div>
        </div>
        <div class="col-sm-8">
            <div class="form-group">
            <label for="title">標題</label>
            <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="temp.title">
            </div>

            <div class="row">
            <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" type="text" class="form-control"
                        placeholder="請輸入分類" v-model="temp.category">
            </div>
            <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="temp.unit">
            </div>
            </div>

            <div class="row">
            <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="temp.origin_price ">
            </div>
            <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" type="number" min="0" class="form-control"
                        placeholder="請輸入售價" v-model.number="temp.price">
            </div>
            </div>
            <hr>

            <div class="form-group">
            <label for="description">產品描述</label>
            <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入產品描述" v-model="temp.description">
            </textarea>
            </div>
            <div class="form-group">
            <label for="content">說明內容</label>
            <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入說明內容" v-model="temp.content">
            </textarea>
            </div>
            <div class="form-group">
            <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox"
                v-model="temp.is_enabled"   :true-value="1" :false-value="0" >
                <label class="form-check-label" for="is_enabled">是否啟用</label>
            </div>
            </div>
        </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" >
        取消
        </button>
        <button type="button" class="btn btn-primary" @click="productStatus" >
        確認
        </button>
    </div>
    </div>
</div>
    </div>
    `,
    mounted() {
        this.productModalDom = new bootstrap.Modal(this.$refs.productModal)
        this.$emit('emitProductDom',this.productModalDom)
    },
}