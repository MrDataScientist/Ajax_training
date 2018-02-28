<template>
    <div>
        <app-stock v-for="Stock in stocks" :stock="Stock"></app-stock>
    </div>
</template>

<script>
    import Stock from './Stock.vue';

    export default {
        components:{
            appStock:Stock
        }
    }
</script>