<template>
    <div class="col-sm-6 col-md-4">
        <div class="panel panel-success">
            <div class="panel-heading">
                <h3 class="panel-title">
                    NAME
                    <small> (Price: PRICE)</small>
                </h3>
            </div>
            <div class="panel-body">
                <div class="pull-left">
                    <input
                        type="number"
                        class="form-control"
                        placeholder="Quantity"
                    >
                </div>

                <div class="pull-left">
                    <input
                            type="number"
                            class="form-control"
                            placeholder="Quantity"
                    >
                    <div class="pull-right">
                        <button
                                class="btn btn-success"
                                @click="buyStock"
                        >Buy</button>
                             <!--   :disabled="quantity <=0"  -->

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        props:['stock'],
        data(){
            return{
                quantity:0
            }
        },
        methods:{
            buyStock(){
                const order={
                    stockId: this.stock.id,
                    stockPrice: this.stock.price,
                    quantity: this.quantity
                };
                console.log(order);
                this.quantity = 0;
            }
        }
    }
</script>