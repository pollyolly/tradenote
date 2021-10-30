import Vue from 'nativescript-vue'
import { CheckBox } from '@nstudio/nativescript-checkbox';
import routes from "~/router"
import store from '~/store';
import TradeNote from '~/components/TradeNote'

Vue.prototype.$router = routes; //Routing
Vue.prototype.$goTo = function(to, options) {
  var options = options || {  clearHistory: false,
                              backstackVisible: true,
                              animated: true,
                              transition: {
                                  name: "fade",
                                  duration: 200,
                                  curve: "easeIn"
                              }
  }
  this.$navigateTo(this.$router[to], options);
}
Vue.registerElement(
  'CheckBox',
  () => CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
);
new Vue({
  store,
  template: `
      <Frame>
          <TradeNote />
      </Frame>`,

  components: {
    TradeNote
  }
}).$start();

// new Vue({
//   render: (h) => h('frame', [h(Home)]),
// }).$start()