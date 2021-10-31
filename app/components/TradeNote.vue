<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*" rows="50,30,30,250,*" marginTop="30">
      <GridLayout  col="0" row="0" columns="*,*,*" rows="50" marginRight="10">
        <Button text="Add Coin" @tap="addCoin" class="text-button" row="0" col="0" />
        <Label :text="defaultCoin" class="page-title" row="0" col="1" textAlignment="center" verticalAlignment="center"/>
        <Label text="View all" @tap="$goTo('tradelist')" class="view-all" row="0" col="2" verticalAlignment="center" textAlignment="right"/>
      </GridLayout>
      <ScrollView col="0" row="1" orientation="horizontal" marginLeft="10" marginRight="10">
        <StackLayout orientation="horizontal">
          <Button 
            v-for="item in COIN_LIST" 
            :text="item.coin"
            v-bind:key="item.id" 
            @doubleTap="coinAction(item.coin)" class="text-coin"
            :backgroundColor="item.status > 0 ? '#000':'#666666'" 
            />
        </StackLayout>
      </ScrollView>
      <GridLayout  col="0" row="2" columns="*,*" rows="30" marginLeft="10" marginRight="10">
        <Label text="Recent Trades" class="text-all" row="0" col="0" textAlignment="left" verticalAlignment="center"/>
        <Label :text="'W/L:'+this.countWin+'-'+this.countLose" class="text-all" row="0" col="1" textAlignment="right" verticalAlignment="center"/>
      </GridLayout>
      <ListView col="0" row="3"
            for="item in TRADE_LIST">
            <v-template>
              <GridLayout
                    @doubleTap="tradeAction(item.id,item.buy_amount,item.sell_amount,item.pair,item.sell_date,$index+1)"
                    columns="25,100,*,*,50" rows="25,25" 
                    :backgroundColor="Number(item.buy_amount) < Number(item.sell_amount) ? '#33CC00':'#CC0000'" 
                    padding="1">
                    <Label :text="$index+1" class="text-col0" rowSpan="2" row="0" col="0" textAlignment="center" verticalAlignment="center"/>
                    <Label :text="item.coin+'/'+item.pair" class="text-col1" rowSpan="2" row="0" col="1" textAlignment="center" verticalAlignment="center"/>
                    <Label :text="'Buy: '+item.buy_amount" class="text-col2" row="0" col="2" textAlignment="left" verticalAlignment="bottom"/>
                    <Label :text="'Sell: '+item.sell_amount" class="text-col2" row="1" col="2" textAlignment="left" verticalAlignment="top"/>
                    <Label :text="convertDate(item.buy_date)" class="text-col3" row="0" col="3" textAlignment="center" verticalAlignment="bottom"/>
                    <Label :text="convertDate(item.sell_date)" class="text-col3" row="1" col="3" textAlignment="center" verticalAlignment="top"/>
                    <Label :text="Number(item.buy_amount) < Number(item.sell_amount) ? 'W':'L'" 
                    class="text-col4" rowSpan="2" row="0" col="4" textAlignment="center" verticalAlignment="center"/>
              </GridLayout>
            </v-template>
      </ListView>
      <GridLayout  col="0" row="4" columns="*,*" rows="40,40,40,40,50">
        <Button text="BUY" @tap="enableBuy" class="buy-button" row="0" col="0"/>
        <Button text="SELL" class="sell-button" row="0" col="1"/>
        <Button :text="defaultCoin+'/'+defaultPair" @tap="showPair" class="text-button-two" row="1" col="0" horizontalAlignment="center"/>
        <Button :text="this.setDate" @tap="getDate" class="text-button-two" row="1" col="1" horizontalAlignment="center"/>
        <TextField v-model="buyValue" hint="Buy @ 0.00" :isEnabled="buyStatus" class="buy-textfield" row="2" col="0" colSpan="2" keyboardType="number"/>
        <TextField v-model="sellValue" hint="Sell @ 0.00" :isEnabled="sellStatus" class="buy-textfield" row="3" col="0" colSpan="2" keyboardType="number"/>
        <Button :text="this.saveText" @tap="saveTrade" class="save-button" row="4" col="0"  colSpan="2" horizontalAlignment="center"/>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import eventbus from '~/common/eventbus';
import Database from "~/common/database.js";
import Helper from "~/common/helper.js";
var Toasty = require('@triniwiz/nativescript-toasty').Toasty;
const ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
const picker = new ModalPicker();
import CoinModel from "~/model/CoinModel";
import TradeNoteModel from "~/model/TradeNoteModel";
import PairList from "~/components/PairList";
  export default {
    data(){
      return{
        setDate: Helper.dateFormat(new Date()),
        countWin:0,
        countLose:0,
        tradeId:'',
        buyStatus:false,
        sellStatus:false,
        updateStatus:'',
        buyValue:'',
        sellValue:'',
        pairValue:'USDT',
        coinName:'',
        saveText:'...'
      }
    },
     created(){
      let initDb = () => {
        // Database.deleteDb();
        Database.copyDb(); 
        Database.init();
      };
      initDb();
    },
    mounted(){
      this.coinName = CoinModel.checkDefaultCoin();
      this.$store.dispatch("SET_COIN_LIST");
      this.$store.dispatch("SET_TRADE_LIST",this.defaultCoin);
      this.loadWinLose();
      eventbus.$on('setpair', (result)=>{
        this.pairValue = result;
      });
    },
    computed: {
      ...mapGetters([
    		'COIN_LIST',
        'TRADE_LIST'
		  ]),
      defaultCoin(){
        return this.coinName;
      },
      defaultPair(){
        return this.pairValue;
      }
    },
    methods:{
      loadWinLose(){
        this.countWin = TradeNoteModel.countWin();
        this.countLose = TradeNoteModel.countLose();
      },
      getDate(){
        picker.pickDate({
          theme: "#C0C0C0",
          maxDate: new Date()
        }).then( result => {
          this.setDate = Helper.dateFormat(result.year + "-" + result.month + "-" + result.day);
        });	
      },
      addCoin(){
        prompt({
          title: "Add Coin",
          message: "Put here the coin shortname. i.e Binance - BNB",
          okButtonText: "OK",
          cancelButtonText: "Cancel",
        }).then(result => {
          //not-default=0;default=1;
          if(result.result && result.text != ''){
            if(!CoinModel.checkCoin([result.text])){
              if(CoinModel.addCoin([result.text.toUpperCase(), 0])){
                this.$store.dispatch("SET_COIN_LIST");
                let toast = new Toasty({ text: 'Coin saved!' });
                toast.textColor = '#C0C0C0';
                toast.backgroundColor = '#666666';
                toast.show();
              }
            } else {
                let toast = new Toasty({ text: 'Coin already exists!' });
                toast.textColor = '#C0C0C0';
                toast.backgroundColor = '#666666';
                toast.show();
            }
          }
        });
      },
      saveTrade(){
          if(this.buyStatus && this.coinName!=''){
            let buyValue = Math.round(100*this.buyValue)/100;
            if(TradeNoteModel.addTrade([this.coinName, this.pairValue, buyValue, '', Helper.dateConvert(this.setDate), ''])){
              let toast = new Toasty({ text: 'Trade Buy @ '+this.buyValue });
              toast.textColor = '#C0C0C0';
              toast.backgroundColor = '#000';
              toast.show();
              this.disableAll();
              this.$store.dispatch("SET_TRADE_LIST",this.defaultCoin);
            }
          }
          if(this.sellStatus && this.tradeId != ''){
              let sellValue = Math.round(100*this.sellValue)/100;
              if(TradeNoteModel.updateTrade([sellValue, Helper.dateConvert(this.setDate), this.tradeId])){
                let toast = new Toasty({ text: 'Trade Sold @ '+this.sellValue });
                toast.textColor = '#C0C0C0';
                toast.backgroundColor = '#000';
                toast.show();
                this.disableAll();
                this.$store.dispatch("SET_TRADE_LIST",this.defaultCoin);
              }
          }
          this.loadWinLose();
      },
      tradeAction(id,buyvalue,sellvalue,pair,selldate,row){
        action("Choose action for Trade #"+row, "Cancel", ["Sell Trade", "Delete Trade"])
        .then(result => {
          if(result==='Sell Trade'){
            this.buyValue = buyvalue;
            this.sellValue = sellvalue;
            this.pairValue = pair;
            this.setDate = Helper.dateFormat(selldate);
            this.tradeId = id;
            this.enableSell();
              let toast = new Toasty({ text: 'Ready to sell a trade?' });
              toast.textColor = '#C0C0C0';
              toast.backgroundColor = '#000';
              toast.show();
          }
          if(result==='Delete Trade'){
            if(TradeNoteModel.deleteTrade([id])){
              this.$store.dispatch("SET_TRADE_LIST",this.defaultCoin);
              let toast = new Toasty({ text: 'Trade deleted!' });
              toast.textColor = '#C0C0C0';
              toast.backgroundColor = '#000';
              toast.show();
            }
          }
          this.loadWinLose();
        });
      },
      coinAction(coin){
        action("Choose action for "+coin, "Cancel", ["Select as Default","Delete coin data"])
        .then(result => {
          if(result==='Select as Default'){
            this.coinName = coin;
            if(CoinModel.setDefaultCoin(coin)){
              this.$store.dispatch("SET_COIN_LIST");
              this.$store.dispatch("SET_TRADE_LIST",coin);
              let toast = new Toasty({ text: coin+' is Set as Default coin!' });
              toast.textColor = '#C0C0C0';
              toast.backgroundColor = '#000';
              toast.show();
            }

          }
          if(result==='Delete coin data'){
            TradeNoteModel.deleteTradeCoin([coin]);
            CoinModel.deleteCoin([coin]);
            this.coinName = CoinModel.checkDefaultCoin();
            this.$store.dispatch("SET_COIN_LIST");
            this.$store.dispatch("SET_TRADE_LIST",this.coinName);
            let toast = new Toasty({ text: 'All data of this coin deleted!' });
            toast.textColor = '#C0C0C0';
            toast.backgroundColor = '#000';
            toast.show();
          }
          this.loadWinLose();
        });
      },
      enableBuy(){
        this.buyStatus = true;
        this.sellStatus = false;
        this.setDate = Helper.dateFormat(new Date());
        this.buyValue='';
        this.sellValue='';
        this.tradeId ='';
        this.saveText='BUY';
      },
      enableSell(){
        this.buyStatus = false;
        this.sellStatus = true;
        this.saveText='SELL';
      },
      disableAll(){
        this.buyStatus = false;
        this.sellStatus = false;
      },
      showPair(){
        this.$showModal(PairList);
      },
      convertDate(cdate){
        return Helper.dateFormat(cdate);
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
.text-coin{
  color:#fff;
  font-size:12;
  margin:1;
  padding:0;
  /* background-color:#666666; */
  border-radius:50;
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
.text-button-two {
  color:#666666;
  font-size:12;
  padding:10;
  background-color:#C0C0C0;
}
.buy-textfield{
  color:#C0C0C0;
  font-size:20;
  font-weight: 900;
  padding:5;
  margin:0;
  background-color:#666666;
  placeholder-color: #C0C0C0;
  text-alignment:center;
}
.sell-textfield{
  color:#C0C0C0;
  font-size:20;
  font-weight: 900;
  padding:5;
  margin:0;
  background-color:#666666;
  placeholder-color: #C0C0C0;
  text-alignment:center;
}
.save-button{
  color:#666666;
  font-size:20;
  font-weight: 900;
  padding-top:10;
  padding-bottom:10;
  padding-left:30;
  padding-right:30;
  background-color:#C0C0C0;
}
</style>
