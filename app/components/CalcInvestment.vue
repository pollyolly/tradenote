<template>
    <StackLayout backgroundColor="white" width="200">
        <TextField v-model="investAmount" hint="Amount Investment" class="buy-textfield" keyboardType="number"/>
        <TextField v-model="iniCoinAmount" hint="Initial Coin Price" class="buy-textfield" keyboardType="number"/>
        <TextField v-model="sellCoinAmount" hint="Selling Coin Price" class="buy-textfield" keyboardType="number"/>
        <Label :text="potentialIncome" class="text-income"/>
        <Button text="Calculate Potential Income" @tap="this.calcPotentialIncome" class="calc-button"/>
    </StackLayout>
</template>

<script>
export default {
    data() {
        return {
            investAmount:'',
            iniCoinAmount:'',
            sellCoinAmount:'',
            potentialIncome:0
        }                                                                     
    },
    computed:{
        potentialIncomes(){
            return this.potentialIncome;
        }
    },
    methods:{
        calcPotentialIncome(){
            let coinValue = this.investAmount / this.iniCoinAmount;
            let sellValue = coinValue * this.sellCoinAmount;
             this.potentialIncome = Math.round(10000*sellValue)/10000;
        }
    }
}
</script>
<style scoped>
.calc-button{
   color:#666666;
   font-size:15;
   background-color:#C0C0C0;
}
.buy-textfield{
  color:#C0C0C0;
  font-size:15;
  padding:5;
  margin:0;
  background-color:#666666;
  placeholder-color: #C0C0C0;
  text-alignment:center;
}
.text-income{
    font-size:20;
    text-alignment:center;
}
</style>