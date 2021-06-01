export default{
    props:['pagination',],
    data() {
        return {
            preDisabled:'',
            nextDisabled:''
        }
    },
    methods: {
        nowPage(e){
            console.log('e.target.disabled :>> ', e.target.disabled);
            if(e.target.dataset.page==='pre'){
                console.log('pre',this.page,)
                this.pagination.current_page-=1
                this.$emit('emitPage', this.pagination.current_page)
            }else if(e.target.dataset.page==='next'){
                console.log('next',this.pagination.current_page)
                this.pagination.current_page+=1
                this.$emit('emitPage', this.pagination.current_page)
            }else{
                console.log('now',this.page)
                this.pagination.current_page=e.target.dataset.page
                this.$emit('emitPage', this.pagination.current_page)
            }
        }
    },
    template:` 
            <ul class="pagination justify-content-center pagination-lg">
                <li class="page-item" :class="{'disabled':!pagination.has_pre}">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true"  @click.prevent="$emit('emitPage', pagination.current_page -1)">Previous</a>
                </li>
                <li class="page-item"  :class="{'active':this.pagination.current_page===item}" v-for="(item, index) in pagination.total_pages" :key="item"><a class="page-link" href="#" @click.prevent="$emit('emitPage', item)>{{item}}</a></li>
                <li class="page-item" :class="{'disabled':!pagination.has_next}">
                    <a class="page-link" href="#"  @click.prevent="$emit('emitPage', pagination.current_page +1)">Next</a>
                </li>
            </ul>
    `,
    mounted() {
        console.log(this.pagination)
    },
}