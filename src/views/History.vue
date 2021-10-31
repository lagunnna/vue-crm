<template>
  <div>
    <div class="page-title">
      <h3>{{ 'History_Title' | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      {{ 'NoRecords' | localize }}
      <router-link to="/record">{{ 'AddFirst' | localize }}</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" :page="page" :pageSize="pageSize" />
    </section>

    <paginate
      v-model="page"
      :pageCount="pageCount"
      :clickHandler="pageChangeHandler"
      :prevText="'Back' | localize"
      :nextText="'Forward' | localize"
      :containerClass="'pagination'"
      :pageClass="'waves-effect'">
    </paginate>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import paginationMixin from '@/mixins/pagination.mixin';
import HistoryTable from '@/components/HistoryTable.vue';
import localizeFilter from '@/filters/localize.filter';

export default {
  name: 'history',
  metaInfo() {
    return {
      title: this.$title('Menu_History'),
    };
  },
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');

    this.setup(categories);

    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(this.records.map((record) => ({
        ...record,
        categoryName: (categories.find((c) => c.id === record.categoryId)).title,
        typeClass: record.type === 'income' ? 'green' : 'red',
        typeText: record.type === 'income' ? localizeFilter('Income') : localizeFilter('Outcome'),
      })));

      this.renderChart({
        labels: categories.map((c) => c.title),
        datasets: [{
          label: localizeFilter('CostsForCategories'),
          data: categories.map((c) => this.records.reduce((total, r) => {
            if (r.categoryId === c.id && r.type === 'outcome') {
              return total + +r.amount;
            }
            return total;
          }, 0)),
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(153, 102, 255)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
            'rgba(255, 205, 86)',
            'rgba(255, 159, 64)',
            'rgba(201, 203, 207)',
          ],
          hoverOffset: 4,
        }],
      });
    },
  },
  components: {
    HistoryTable,
  },

};
</script>
