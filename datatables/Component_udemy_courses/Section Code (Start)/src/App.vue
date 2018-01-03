<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <app-user></app-user>
            <hr>
                <app-tarik></app-tarik>
            </div>
        </div>
    </div>
</template>

<script>
    import User from './components/User.vue';
    import Tarik from './components/Tarik.vue';

    export default {
        components: {
            appUser: User,
            appTarik: Tarik
        }
    }
</script>

<style>
    div.component {
        border: 1px solid black;
        padding: 30px;
    }
</style>
