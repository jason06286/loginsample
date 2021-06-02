export default{
    props:['pagination',],
    template:` 
    <ul class="pagination pagination-lg">
        <li class="page-item" :class="{ 'disabled': !pagination.has_pre }">
            <a class="page-link" href="#" @click.prevent="$emit('emitPage', pagination.current_page - 1)">Previous</a>
        </li>
        <li class="page-item"  :class="{'active':pagination.current_page === item}" v-for="(item, index) in pagination.total_pages" :key="index"><a class="page-link" href="#"  @click.prevent="$emit('emitPage', item)">{{ item }}</a></li>
        <li class="page-item" :class="{ 'disabled': !pagination.has_next }">
            <a class="page-link" href="#"  @click.prevent="$emit('emitPage', pagination.current_page + 1)">Next</a>
        </li>
    </ul>
    `,
    mounted() {
        console.log(this.pagination)
    },
}