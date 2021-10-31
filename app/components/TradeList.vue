<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*" rows="50,50,50,*" marginTop="30">
      <GridLayout  col="0" row="0" columns="*,*,*" rows="50" marginRight="10">
        <Button text="Back" @tap="$navigateBack" class="text-button" row="0" col="0" />
        <Label :text="defaultCoin" class="page-title" row="0" col="1" textAlignment="center" verticalAlignment="center"/>
      </GridLayout>
      <GridLayout  col="0" row="1" columns="*,*,*,*" rows="40, 30, 30" marginLeft="10" marginRight="10" marginTop="10">
          <Button :text="this.setYear" @tap="showYears" class="text-filter-left" row="0" col="0" />
          <Button :text="this.setMonth" @tap="showMonths" class="text-filter-right" row="0" col="1" />
          <Button text="7 days" @tap="recentWeek" class="text-filter" row="0" col="2" />
          <Button text="Today" @tap="currentDay" class="text-filter" row="0" col="3" />
          <Label :text="'Trades: '+this.countTrade" class="text-all" row="1" col="0" colSpan="2" horizontalAlignment="left"/>
          <Label :text="'W/L:'+this.countWin+'-'+this.countLose" class="text-all" row="1" col="2" colSpan="2" horizontalAlignment="right"/>
      </GridLayout>
      <GridLayout  col="0" row="2" columns="*,*,*" rows="50">
          <check-box text="BUY" :checked="buyChecked" @checkedChange="buyChecked = $event.value" row="0" col="0"/>
          <check-box text="SELL" :checked="sellChecked" @checkedChange="sellChecked = $event.value" row="0" col="1"/>
          <Button text="Filter" @tap="filterList" class="text-button" row="0" col="2" />
      </GridLayout>
      <ListView col="0" row="3" marginBottom="5"
            for="item in FILTER_LIST">
            <v-template>
              <GridLayout columns="25,100,*,*,50" rows="25,25" padding="1" marginBottom="2"
                :backgroundColor="Number(item.buy_amount) < Number(item.sell_amount) ? '#33CC00':'#CC0000'" 
                >
                <Label :text="$index+1" class="text-col0" rowSpan="2" row="0" col="0" textAlignment="center" verticalAlignment="center"/>
                <Label :text="item.coin+'/'+item.pair" class="text-col1" rowSpan="2" row="0" col="1" textAlignment="center" verticalAlignment="center"/>
                <Label :text="'Buy: '+item.buy_amount" class="text-col2" row="0" col="2" textAlignment="left" verticalAlignment="bottom"/>
                <Label :text="'Sell: '+item.sell_amount" class="text-col2" row="1" col="2" textAlignment="left" verticalAlignment="top"/>
                <Label :text="convertDate(item.buy_date)" class="text-col3" row="0" col="3" textAlignment="center" verticalAlignment="bottom"/>
                <Label :text="convertDate(item.sell_date)" class="text-col3" row="1" col="3" textAlignment="center" verticalAlignment="top"/>
                <Label :text="Number(item.buy_amount) < Number(item.sell_amount) ? 'W':'L'" class="text-col4" rowSpan="2" row="0" col="4" textAlignment="center" verticalAlignment="center"/>
            </GridLayout>
            </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import eventbus from '~/common/eventbus';
import Helper from "~/common/helper.js";
import CoinModel from "~/model/CoinModel";
import TradeNoteModel from "~/model/TradeNoteModel";
import TradeListModel from "~/model/TradeListModel";
import YearList from "~/components/YearList";
import MonthList from "~/components/MonthList";
  export default {
    data(){
      return {
        countWin:0,
        countLose:0,
        countTrade:0,
        coinName:'',
        filterBy:'',
        dateSet:'',
        setYear:'Year',
        setMonth:'Month',
        buyChecked: false,
        sellChecked: false
      }
    },
    mounted(){
      this.coinName = CoinModel.checkDefaultCoin();
      this.$store.dispatch("SET_FILTER_LIST",{
        'buySell': '',
        'coin': this.defaultCoin,
        'filterBy': '',
        'dateSet': ''
      });
      this.loadWinLose();
      eventbus.$on('setyear', (result)=>{
        this.setYear = result;
        this.dateSet = result;
        this.filterBy = 'year';
      });
      eventbus.$on('setmonth', (result)=>{
        this.setMonth = result;
        this.dateSet = this.setYear +'-'+Helper.convertMonth(result);
        this.filterBy = 'month';
      });
    },
    computed: {
      ...mapGetters([
        'FILTER_LIST'
		  ]),
      defaultCoin(){return this.coinName;},
      getBuystat(){return this.buyChecked;},
      getSellstat(){return this.sellChecked;}
    },
    methods:{
      loadWinLose(){
        this.countWin = TradeNoteModel.countWin();
        this.countLose = TradeNoteModel.countLose();
        this.countTrade = TradeNoteModel.countTrade();
      },
      recentWeek(){
        this.filterBy = '7days'
        this.dateSet = '';
        this.setYear = 'Year';
        this.setMonth = 'Month';
      },
      currentDay(){
        this.filterBy = 'today'
        this.dateSet = '';
        this.setYear = 'Year';
        this.setMonth = 'Month';
      },
      filterList(){
        if(this.buyChecked){
          this.$store.dispatch("SET_FILTER_LIST",{
            'buySell': 'buy',
            'coin': this.defaultCoin,
            'filterBy': this.filterBy,
            'dateSet': this.dateSet
          });
          this.sellChecked = false;
        }
        if(this.sellChecked){
          this.$store.dispatch("SET_FILTER_LIST",{
            'buySell': 'sell',
            'coin': this.defaultCoin,
            'filterBy': this.filterBy,
            'dateSet': this.dateSet
          });
          this.buyChecked = false;
        }
      },
      convertDate(cdate){
        return Helper.dateFormat(cdate);
      },
      showYears(){
        this.$showModal(YearList);
      },
      showMonths(){
        this.$showModal(MonthList);
      }
    }
  };
</script>

<style scoped>
.page-title{
  color:#666666;
  font-size:30;
  font-weight:900;
}
.view-all {
  color:#666666;
  font-size:15;
  font-weight:900;
}
.text-all{
  color:#666666;
  font-size:15;
}
.text-filter{
  color:#fff;
  font-size:12;
  margin:1;
  padding:0;
  background-color:#666666;
  border-radius:50;
}
.text-filter-left{
  color:#fff;
  font-size:12;
  margin:1;
  padding:0;
  background-color:#666666;
  border-radius:50 0 0 50;
}
.text-filter-right{
  color:#fff;
  font-size:12;
  margin:1;
  padding:0;
  background-color:#666666;
  border-radius:0 50 50 0;
}
.text-col0{
  color:#C0C0C0;
  font-size:12;
  background-color:#666666;
  margin-right:2;
  padding-top:13;
  padding-bottom:13;
}
.text-col1{
  color:#C0C0C0;
  font-size:12;
  background-color:#666666;
  margin-right:2;
  padding-top:13;
  padding-bottom:13;
}
.text-col2{
  color:#C0C0C0;
  font-size:12;
  background-color:#666666;
  padding-top:2;
  padding-bottom:2;
  padding-left:10;
}
.text-col3{
  color:#C0C0C0;
  font-size:12;
  background-color:#666666;
  padding-top:2;
  padding-bottom:2;
}
.text-col4{
  color:#fff;
  font-size:25;
  font-weight:900;
}
.text-button{
  color:#666666;
  font-size:15;
  font-weight:900;
}
.buy-button{
  color:#fff;
  font-size:15;
  font-weight:900;
  background-color:#009900;
  width:100%;
  padding-bottom:0;
  margin-bottom:0;
}
.sell-button{
  color:#fff;
  font-size:15;
  font-weight:900;
  background-color:#990000;
  width:100%;
  padding-bottom:0;
  margin-bottom:0;
}
</style>
