<template>
    <StackLayout backgroundColor="white">
        <ListPicker :items="getlistItems" v-model="selectedItem" class="picker-list" textalignment="center"/>
        <Button text="SET" @tap="setPair" class="text-button"/>
    </StackLayout>
</template>

<script>
import eventbus from '~/common/eventbus';
import Helper from "~/common/helper.js";
export default {
    data() {
        return {
            listOfItems:[],
            selectedItem:0
        }                                                                     
    },
    mounted(){
        this.listOfItems = Helper.generateYears(2016);
    },
    computed:{
        getlistItems(){
            return this.listOfItems;
        }
    },
    methods:{
        setPair(){
            eventbus.$emit('setyear', this.listOfItems[this.selectedItem]);
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