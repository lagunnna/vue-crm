import Vue from 'vue';
import localizeFilter from '@/filters/localize.filter';

export default {
  install() {
    Vue.prototype.$title = function (titleKey) {
      const appName = process.env.VUE_APP_TITLE;
      return `${localizeFilter(titleKey)} | ${appName}`;
    };
  },
};
