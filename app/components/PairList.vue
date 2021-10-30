<template>
    <StackLayout backgroundColor="white">
        <ListPicker :items="listOfItems" v-model="selectedItem" class="picker-list" textalignment="center"/>
        <Button text="SET" @tap="setPair" class="text-button"/>
    </StackLayout>
</template>

<script>
import eventbus from '~/common/eventbus';
export default {
    data() {
        return {
            listOfItems:['USDT','PAX','TUSD','USDC','UST','DAI','KAI','BUSD','BNB','TUSDT','USDC'],
            selectedItem:0
        }                                                                     
    },
    methods:{
        setPair(){
            eventbus.$emit('setpair', this.listOfItems[this.selectedItem]);
            this.$modal.close();
        }
    }
}
</script>
<style scoped>
.text-button{
   color:#C0C0C0;
   font-size:12;
   background-color:#666666;
}
.picker-list{
    color:#666666;
}
</style>