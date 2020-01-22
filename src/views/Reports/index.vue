<template>
  <div id="list-complete-demo" class="demo" style="text-align-last: center;">
    <el-card class="box-card">
      <el-button class="pan-btn light-blue-btn" v-on:click="filter('Accounting')">{{ $t('route.Accounting') }}</el-button>
      <el-button class="pan-btn yellow-btn" v-on:click="filter('S&P')">{{ $t('route.Salesand') }}</el-button>
      <el-button class="pan-btn pink-btn" v-on:click="filter('Inventory')">{{ $t('NewPurchaseInvoice.Inventory') }}</el-button>
      <el-button class="pan-btn green-btn" v-on:click="filter('Classifications')">{{ $t('route.Classification') }}</el-button>
      <el-button class="pan-btn blue-btn" v-on:click="filter('all')">{{ $t('route.All') }}</el-button>
    </el-card>
    <el-card class="box-card" style="margin-bottom:50px;">
      <transition-group name="list-complete" class="list-complete" tag="section">
        <el-col
          style="margin-top: 20px;"
          :span="4"
          class="list-complete-item"
          v-for="item in filteredItems"
          v-bind:key="item.id"
        >
          <router-link :class="item.class" icon="el-icon-plus" :to="item.link">{{ item.name }}</router-link>
        </el-col>
      </transition-group>
    </el-card>
  </div>
</template>
<script>
export default {
  el: "#list-complete-demo",
  data() {
    return {
      items: [
        {
          id: 1,
          name: "Vendor",
          link: "/Vendor/index",
          tags: ["all", "Accounting"],
          class: "pan-btn light-blue-btn"
        },
        {
          id: 2,
          name: "Sales Items",
          link: "/Sales/SalesItems",
          tags: ["all", "S&P"],
          class: "pan-btn yellow-btn"
        },
        {
          id: 3,
          name: "Purchase",
          link: "/Purchase/index",
          tags: ["all", "S&P"],
          class: "pan-btn yellow-btn"
        },
        {
          id: 4,
          name: "Purchase Items",
          link: "/Purchase/PurchaseItems",
          tags: ["all", "S&P"],
          class: "pan-btn yellow-btn"
        },
        {
          id: 5,
          name: "Accounting",
          link: "/Accounting/index",
          tags: ["all", "Accounting"],
          class: "pan-btn light-blue-btn"
        },
        {
          id: 6,
          name: "Entry Accounting",
          link: "/Accounting/EntryAccounting",
          tags: ["all", "Accounting"],
          class: "pan-btn light-blue-btn"
        },
        {
          id: 7,
          name: "Item",
          link: "/Item",
          tags: ["all", "Inventory"],
          class: "pan-btn pink-btn"
        },
        {
          id: 8,
          name: "Order Inventories",
          link: "/OrderInventories",
          tags: ["all", "Inventory"],
          class: "pan-btn pink-btn"
        },
        {
          id: 9,
          name: "Inventory",
          link: "/Inventory",
          tags: ["all", "Inventory"],
          class: "pan-btn pink-btn"
        },
        {
          id: 10,
          name: "Group Item",
          link: "/MenuItem",
          tags: ["all", "Classifications"],
          class: "pan-btn green-btn"
        },
        {
          id: 11,
          name: "Origin Item",
          link: "/OriginItem",
          tags: ["all", "Classifications"],
          class: "pan-btn green-btn"
        },
        {
          id: 12,
          name: "Unit Item",
          link: "/UnitItem",
          tags: ["all", "Classifications"],
          class: "pan-btn green-btn"
        }
      ],
      currentTag: "all"
    };
  },
  computed: {
    filteredItems: function() {
      var filter = this.currentTag;
      return this.items.filter(function(item) {
        return item.tags.indexOf(filter) !== -1;
      });
    }
  },
  methods: {
    shuffle: function() {
      this.items = _.shuffle(this.items);
    },
    filter: function(tag) {
      this.currentTag = tag;
    }
  }
};
</script>
