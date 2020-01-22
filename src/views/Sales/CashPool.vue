<template>
  <div class="app-container">
    <el-card class="box-card" style="
    font-size: medium">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="fa fa-save"
          @click="createData('tempForm')"
        >{{ $t('CashPool.Save') }}</el-button>
        <span class="demonstration">{{ $t('NewPurchaseInvoice.Box') }}</span>
        <el-select v-model="CashAccount" filterable placeholder="صندوق" autocomplete="off">
          <el-option
            v-for="item in CashAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
        <span>{{$t('CashPool.Note')}}</span>
      </div>

      <el-divider direction="vertical"></el-divider>
      <span>{{$t('CashPool.Invoice')}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{Selection.length}}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{$t('CashPool.Cash')}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{TotalCash.toFixed(3)}} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{$t('CashPool.debt')}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{TotalReceivables.toFixed(3)}} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{$t('CashPool.Amount')}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{(TotalCash + TotalReceivables).toFixed(3)}} JOD</span>
      <el-divider direction="vertical"></el-divider>
    </el-card>

    <el-card class="box-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="#" prop="ID" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('CashPool.Date')"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="Name" v-bind:label="$t('CashPool.Customer')" align="center"></el-table-column>
        <el-table-column
          prop="PaymentMethod"
          v-bind:label="$t('CashPool.Pay')"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Discount')" width="120" align="center">
          <template slot-scope="scope">{{(scope.row.Discount).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.InventoryMovements.reduce(
            function(prev, cur) {return prev + cur.Qty * cur.SellingPrice;},0).toFixed(3) }} JOD
          </template>
        </el-table-column>
        <el-table-column width="60" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-printer"
              type="primary"
              @click="print(scope.row.InventoryMovements)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.InventoryMovements">
              <el-table-column
                prop="Name"
                v-bind:label="$t('CashPool.Items')"
                width="130"
                align="center"
              ></el-table-column>
              <el-table-column prop="Qty" v-bind:label="$t('CashPool.quantity')" align="center"></el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
                <template slot-scope="scope">{{(scope.row.SellingPrice).toFixed(3) }}</template>
              </el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
                <template
                  slot-scope="scope"
                >{{(scope.row.SellingPrice * scope.row.Qty).toFixed(3) }} JOD</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetSaleInvoiceByStatus } from "@/api/SaleInvoice";
import { GetCashAccounts } from "@/api/Account";
import { Create } from "@/api/EntryAccounting";
import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";

export default {
  name: "CashPool",
  data() {
    return {
      loading: true,
      tableData: [],
      Selection: [],
      CashAccounts: [],
      CashAccount: 1,
      TotalCash: 0,
      TotalReceivables: 0
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    handleSelectionChange(val) {
      this.Selection = val;
      this.TotalReceivables = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Receivables"
            ? b.InventoryMovements.reduce(function(prev, cur) {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0)
            : 0),
        0
      );
      this.TotalCash = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Cash"
            ? b.InventoryMovements.reduce(function(prev, cur) {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0)
            : 0),
        0
      );
    },
    getdata() {
      this.loading = true;
      GetCashAccounts().then(response => {
        // handle success
        console.log(response);
        this.CashAccounts = response;
      });
      GetSaleInvoiceByStatus({ Status: 0 })
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    print(data) {
      data = data.map(Item => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(3)
      }));
      printJS({
        printable: data,
        properties: ["Name", "Qty", "SellingPrice", "Total"],
        type: "json"
      });
    },
    createData(formName) {
      var tempForm = {
        ID: undefined,
        FakeDate: new Date(),
        Description: "",
        EntryMovements: [
          {
            ID: undefined,
            AccountID: 40,
            Debit: this.TotalCash + this.TotalReceivables,
            Credit: 0.0,
            Description:
              "قيد اغلاق لصندوق (" +
              this.CashAccounts.find(obj => {
                return obj.value == this.CashAccount;
              }) +
              ") رقم[" +
              this.CashAccount +
              "] لمجموعة فواتير رقم [" +
              this.Selection.map(a => a.ID) +
              "]",
            EntryID: undefined
          },
          {
            ID: undefined,
            AccountID: this.CashAccount,
            Debit: 0.0,
            Credit: this.TotalCash,
            Description:
              "قيد إغلاق لصندوق (" +
              this.CashAccounts.find(obj => {
                return obj.value == this.CashAccount;
              }) +
              ") رقم[" +
              this.CashAccount +
              "] لمجموعة فواتير رقم [" +
              this.Selection.filter(el => el.PaymentMethod == 1).map(
                a => a.ID
              ) +
              "]",
            EntryID: undefined
          }
        ]
      };
      this.Selection.forEach(i => {
        if (i.PaymentMethod == 0)
          tempForm.EntryMovements.push({
            ID: undefined,
            AccountID: i.Account.ID,
            Debit: 0.0,
            Credit: i.InventoryMovements.reduce(
            function(prev, cur) {return prev + cur.Qty * cur.SellingPrice;},0),
            Description: "فاتورة مبيعات رقم " + i.ID + " ",
            EntryID: undefined
          });
      });
      console.log(tempForm);
      Create(tempForm)
        .then(response => {
          console.log(response);
          let IDS = this.Selection.map(a => {
            ChangeObjStatus({
              ObjID: a.ID,
              OprationID: 1000000022,
              Description: "فاتورة مؤكدة"
            }).then(response => {
              console.log(response);
            });
          });
          console.log(IDS);

          this.$notify({
            title: "تم الإضافة بنجاح",
            message: "تم الإضافة بنجاح",
            type: "success",
            position: "top-left",
            duration: 1000,
            showClose: false,
            onClose: () => {
              Object.assign(this.$data, this.$options.data());
              this.getdata();
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>