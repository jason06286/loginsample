export default{
    props:['pagination',],
    data() {
        return {
            page:Number(this.pagination.current_page) 
        }
    },
    methods: {
        nowPage(e){
                console.log(this.pagination.current_page)
                        
            if(e.target.dataset.page==='pre'){
                console.log('pre',this.page)
                this.page-=1
                this.$emit('emitPage', this.page)
            }else if(e.target.dataset.page==='next'){
                console.log('next',this.page)
                this.page+=1
                this.$emit('emitPage', this.page)
            }else{
                console.log('now',this.page)
                this.page=e.target.dataset.page
                this.$emit('emitPage', this.page)
            }
        }
    },
    template:` 
        <ul class="pagination" @click.prevent="nowPage">
            <li class="page-item" :disabled="pagination.has_pre" ><a class="page-link" href="#" data-page="pre">Previous</a></li>
            <li class="page-item"   v-for="(item, index) in pagination.total_pages" :key="item" ><a class="page-link" href="#" :data-page="item">{{item}}</a></li>
            <li class="page-item" :disabled="pagination.has_next" ><a class="page-link" href="#" data-page="next">Next</a></li>
        </ul>  
    `,
    mounted() {
        this.pagination
    },
}