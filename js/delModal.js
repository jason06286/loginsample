export default{
    props:['delItem',],
    data() {
        return {
            url :'https://vue3-course-api.hexschool.io/',
            path :'jason06286',
            delModalDom:''
        }
    },
    methods: {
        delProduct() {
            axios({
                method: 'delete',
                url: `${this.url}api/${this.path}/admin/product/${this.delItem.id}`,
            })
                .then(res => {
                    console.log(res)
                    alert(res.data.message)
                    if(res.data.success){
                        this.delModalDom.hide()
                        this.$emit('emitGetProduct')
                    }
                })
                .catch(err => {
                    console.log(err.response)
                })
    },
    },
    template:`   <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
<div class="modal-dialog">
    <div class="modal-content border-0">
    <div class="modal-header bg-danger text-white">
        <h5 id="delProductModalLabel" class="modal-title">
        <span>刪除產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        是否刪除
        <strong class="text-danger">{{delItem.title}}</strong> 商品(刪除後將無法恢復)。
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
        取消
        </button>
        <button type="button" class="btn btn-danger" @click="delProduct">
        確認刪除
        </button>
    </div>
    </div>
</div>
</div>
    `,
    mounted() {
        this.delModalDom = new bootstrap.Modal(this.$refs.delProductModal)
        this.$emit('emitDelDom',this.delModalDom)
        console.log(this.delItem)
    },
}