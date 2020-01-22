<template>
  <div class="app-container">
    <el-form
      ref="tempForm"
      :model="tempForm"
      label-position="top"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button style="float: left" type=" " icon="fa fa-save" @click="createData()">حفظ</el-button>
          <span>{{ $t('NewPurchaseInvoice.PurchaseInvoice') }}</span>
          <p style="color: #F56C6Cfont-size: 16pxtext-align: center">{{ ValidateNote }}</p>
        </div>
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('NewPurchaseInvoice.ReleaseDate')"
              :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' }]"
            >
              <el-date-picker
                v-model="tempForm.FakeDate"
                type="date"
                v-bind:placeholder="$t('NewPurchaseInvoice.Date')"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              v-bind:label="$t('NewPurchaseInvoice.Box')"
              prop="AccountID"
              :rules="[{ required: true, message: 'لايمكن ترك الحساب فارغ', trigger: 'blur' }, ]"
              v-if="tempForm.PaymentMethod == 'Cash'"
            >
              <el-select
                v-model="tempForm.AccountID"
                filterable
                v-bind:placeholder="$t('NewPurchaseInvoice.Box')"
                autocomplete="off"
              >
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
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-bind:label="$t('NewPurchaseInvoice.ToPr')"
              prop="AccountID"
              :rules="[{ required: true, message: 'لايمكن ترك الحساب فارغ', trigger: 'blur' }, ]"
              v-if="tempForm.PaymentMethod == 'Vendor'"
            >
              <el-select
                v-model="tempForm.AccountID"
                filterable
                v-bind:placeholder="$t('NewPurchaseInvoice.Acc')"
                autocomplete="off"
              >
                <el-option
                  v-for="item in Vendor"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: right">{{ item.label }}</span>
                  <span style="float: left color: #8492a6 font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              prop="PaymentMethod"
              v-bind:label="$t('NewPurchaseInvoice.PaymentMethod')"
            >
              <el-radio
                v-model="tempForm.PaymentMethod"
                @change="tempForm.AccountID = undefined"
                label="Cash"
                border
              >{{ $t('NewPurchaseInvoice.Cash') }}</el-radio>
              <el-radio
                v-model="tempForm.PaymentMethod"
                @change="tempForm.AccountID = undefined"
                label="Vendor"
                border
              >{{ $t('NewPurchaseInvoice.Receivables') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              prop="InvoicePurchaseDate"
              v-bind:label="$t('NewPurchaseInvoice.InvDate')"
              :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' }]"
            >
              <el-date-picker
                v-model="tempForm.InvoicePurchaseDate"
                type="date"
                v-bind:placeholder="$t('NewPurchaseInvoice.Date')"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item v-bind:label="$t('NewPurchaseInvoice.statement')">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-card class="box-card">
          <el-col>
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="Barcode"
              :fetch-suggestions="SearchBarcode"
              v-bind:placeholder="$t('NewPurchaseInvoice.Barcode')"
              @select="AddItem"
              @focus="show"
              style="width:100%"
            >
              <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
              <template slot-scope="{ item }">
                <div class="ID">{{ item.Barcode }}</div>
                <span class="Name">{{ item.Name }}</span>
              </template>
            </el-autocomplete>
          </el-col>
        </el-card>

        <el-table
          :data="tempForm.InventoryMovements"
          fit
          border
          max-height="280"
          highlight-current-row
        >
          <el-table-column align="center">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t('NewPurchaseInvoice.Items') }} ({{tempForm.TotalItems.toFixed(2)}})</template>
            <template slot-scope="scope">
              <el-form-item :prop="'InventoryMovements.'+scope.$index+'.ItemsID'">
                <el-select
                  v-model="tempForm.InventoryMovements[scope.$index].ItemsID"
                  filterable
                  v-bind:placeholder="$t('NewPurchaseInvoice.Items')"
                  autocomplete="off"
                >
                  <el-option
                    v-for="item in Items"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  >
                    <span style="float: right">{{ item.ID }}</span>
                    <span style="float: left color: #8492a6 font-size: 13px">{{ item.Name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column width="130" align="center">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t('NewPurchaseInvoice.quantity') }} ({{tempForm.TotalQty.toFixed(2)}})</template>
            <template slot-scope="scope">
              <el-input-number
                @change="SumTotalAmmount"
                controls-position="right"
                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                :precision="2"
                :step="1"
                :min="0.00"
                :max="1000000"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center">
            <template slot="header" slot-scope="{}">{{ $t('NewPurchaseInvoice.Price') }}</template>
            <template slot-scope="scope">
              <el-input-number
                @change="SumTotalAmmount"
                controls-position="right"
                v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
                :precision="2"
                :step="1"
                :min="0.00"
                :max="1000000"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center">
            <template slot="header" slot-scope="{}">{{ $t('NewPurchaseInvoice.TotalValue') }}</template>
            <template
              slot-scope="scope"
            >{{(tempForm.InventoryMovements[scope.$index].SellingPrice * tempForm.InventoryMovements[scope.$index].Qty).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{}">{{ $t('NewPurchaseInvoice.Inventory') }}</template>
            <template slot-scope="scope">
              <el-radio-group
                v-model="tempForm.InventoryMovements[scope.$index].InventoryItemID"
                
              >
                <el-radio-button
                  v-for="(item , index ) in InventoryItems"
                  :key="index"
                  :label="item.value"
                >{{item.label}}</el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column
            v-bind:label="$t('NewPurchaseInvoice.description')"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item :prop="'InventoryMovements.'+scope.$index+'.Description'">
                <el-input
                  v-model="tempForm.InventoryMovements[scope.$index].Description"
                  required
                  class="input-with-select"
                >
                  <template slot="prepend">
                    <el-button @click="Copy(scope.row.Description)" icon="fa fa-copy"></el-button>
                  </template>
                  <template slot="append">
                    <el-button @click="Paste(scope.$index)" icon="fa fa-paste"></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" @click="RemoveItem(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-row type="flex">
        <el-col :span="16">
          <el-card shadow="hover">
            <template>
              <div>
                <span>{{ $t('NewPurchaseInvoice.Items') }}</span>
                <el-divider>{{tempForm.TotalItems.toFixed(2)}}</el-divider>
                <span>{{ $t('NewPurchaseInvoice.QuantityAmount') }}</span>
                <el-divider>{{tempForm.TotalQty.toFixed(2)}}</el-divider>
                <span>{{ $t('NewPurchaseInvoice.TotalDiscount') }}</span>
                <el-divider>
                  <el-input-number
                    @change="SumTotalAmmount"
                    v-model="tempForm.Discount"
                    :precision="2"
                    :step="1"
                    :min="0.00"
                    :max="100"
                  ></el-input-number>
                </el-divider>
                <span>{{ $t('NewPurchaseInvoice.TotalJD') }}</span>
                <el-divider>{{tempForm.TotalAmmount.toFixed(2)}} $</el-divider>
              </div>
            </template>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="AddItem"
            >{{ $t('NewPurchaseInvoice.AddMore') }}</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create } from "@/api/PurchaseInvoice";
import { GetCompanyInfo } from "@/api/CompanyInfo";

import { GetActiveInventory } from "@/api/InventoryItem";
import { GetActiveItem } from "@/api/Item";
import { GetCashAccounts } from "@/api/Account";
import { GetActiveVendor } from "@/api/Vendor";

export default {
  name: "NewPurchaseInvoice",
  data() {
    return {
      input: null,
      Barcode: "",
      Text: "",
      ValidateNote: "",
      tempForm: {
        ID: undefined,
        TotalAmmount: 0,
        Tax: 0.0,
        TotalQty: 0,
        TotalItems: 0,
        FakeDate: new Date(),
        InvoicePurchaseDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        AccountID: undefined,
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إستكمال عملية الشراء من غير إضافة أصناف",
            trigger: "change"
          }
        ]
      },
      InventoryItems: [],
      Items: [],
      CashAccounts: [],
      Vendor: []
    };
  },
  methods: {
    AddItem(item) {
      this.tempForm.InventoryMovements.push({
        ID: undefined,
        ItemsID: item != undefined ? item.ID : undefined,
        TypeMove: "In",
        Status: 0,
        Qty: 1.0,
        SellingPrice: 0,
        Tax: 0.0,
        Description: "",
        InventoryItemID: 1,
        Itemx: item,
        PurchaseInvoiceID: undefined
      });
      this.SumTotalAmmount();
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
      this.SumTotalAmmount();
    },
    SumTotalAmmount() {
      this.tempForm.TotalItems = this.tempForm.InventoryMovements.length;
      this.tempForm.TotalQty = this.tempForm.InventoryMovements.reduce(
        (a, b) => a + (b["Qty"] || 0),
        0
      );
      this.tempForm.TotalAmmount = this.tempForm.InventoryMovements.reduce(
        function(prev, cur) {
          return prev + cur.Qty * cur.SellingPrice;
        },
        0
      );
      this.tempForm.TotalAmmount -= this.tempForm.Discount;
    },
    SearchBarcode(queryString, cb) {
      var Items = this.Items;
      var results = queryString
        ? Items.filter(this.createFilter(queryString))
        : Items;
      // call callback function to return suggestion objects
      cb(results);
    },
    createFilter(queryString) {
      return Item => {
        return (
          Item.Barcode.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    getdata() {
      GetActiveInventory().then(response => {
        console.log(response);
        this.InventoryItems = response;
      });
      GetActiveItem().then(response => {
        console.log(response);
        this.Items = response;
      });
      GetCashAccounts().then(response => {
        console.log(response);
        this.CashAccounts = response;
      });
      GetActiveVendor().then(response => {
        console.log(response);
        this.Vendor = response;
      });
    },
    Copy(Text) {
      this.Text = Text;
    },
    Paste(Index) {
      this.tempForm.InventoryMovements[Index].Description = this.Text;
    },
    show(e) {
      this.input = e.target;
    },
    createData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          this.tempForm.PaymentMethod = parseInt(this.tempForm.PaymentMethod);
          this.tempForm.Tax = parseInt(this.tempForm.Tax);

          if (
            this.tempForm.TotalAmmount > 0 &&
            this.tempForm.TotalItems > 0 &&
            this.tempForm.TotalQty > 0
          ) {
            Create(this.tempForm)
              .then(response => {
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
          } else this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    this.getdata();
  }
};
</script>
