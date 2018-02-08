<template>
    <div>
        <app-stock v-for="Stock in stocks" :stock="Stock"></app-stock>
    </div>
</template>

<script>
    import Stock from './Stock.vue';

    export default {
        data(){
            return{
                stocks:[
                    {id:1, name:'BMW', price:983},
                    {id:2, name:'Ford', price:367},
                    {id:3, name:'Mercedes', price:200},
                    {id:4, name:'BMW', price:145},
                ]
            }
        },
        components:{
            appStock:Stock
        }
    }
</script>