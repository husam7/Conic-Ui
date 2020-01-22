<template>
  <div>
    <el-form ref="tempForm" :rules="rules" :model="tempForm" label-position="right">
      <div class="components-container" style="direction: rtl; ">
        <split-pane split="horizontal" :min-percent="6.5" :default-percent="6.5">
          <template slot="paneL">
            <el-row type="flex" style="background : #2f3542; color: white;">
              <el-col :span="4">
                <el-button
                  type="success"
                  icon="el-icon-s-home"
                  @click="$router.replace({ path: '/redirect' + '/dashboard' })"
                ></el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
              </el-col>
              <el-col v-permission="['admin']" :span="6">
                <el-form-item
                  prop="FakeDate"
                  :rules="[{type: 'date', required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' } ]"
                >
                  <el-date-picker
                    v-model="tempForm.FakeDate"
                    type="date"
                    v-bind:placeholder="$t('CashPool.Date')"
                    format="dd/MM/yyyy"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  prop="VendorID"
                  :rules="[{ required: true, message: 'لايمكن ترك حساب فارغ', trigger: 'blur' }, ]"
                >
                  <el-select
                    v-model="tempForm.VendorID"
                    filterable
                    v-bind:placeholder="$t('NewPurchaseInvoice.Acc')"
                    autocomplete="off"
                    default-first-option
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
                <el-form-item prop="PaymentMethod">
                  <el-radio-group v-model="tempForm.PaymentMethod" style="color: #ffffff;">
                    <el-radio label="Cash" border>{{ $t('NewPurchaseInvoice.Cash') }}</el-radio>
                    <el-radio
                      v-if="tempForm.VendorID != 1"
                      label="Receivables"
                      border
                    >{{ $t('NewPurchaseInvoice.Receivables') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <size-select id="size-select" class="right-menu-item hover-effect" />
                <screenfull id="screenfull" class="right-menu-item hover-effect" />
                <lang-select class="right-menu-item hover-effect" />
              </el-col>
            </el-row>
          </template>
          <template slot="paneR">
            <split-pane split="horizontal" :min-percent="42.5" :default-percent="48">
              <template slot="paneL">
                <split-pane split="vertical" :min-percent="40" :default-percent="30">
                  <template slot="paneL">
                    <el-card style="background: #808e9b;">
                      <el-row type="flex">
                        <el-col :span="11">
                          <el-input data-barcode v-model="Barcode" placeholder="باركود صنف">
                            <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
                          </el-input>
                        </el-col>

                        <el-col :span="9">
                          <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="Name"
                            :fetch-suggestions="SearchNameItem"
                            placeholder="اسم صنف"
                            @select="AddItem"
                          >
                            <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
                            <template slot-scope="{ item }">
                              <div class="ID">{{ item.Barcode }}</div>
                              <span class="Name">{{ item.Name }}</span>
                            </template>
                          </el-autocomplete>
                        </el-col>
                        <el-col :span="4">
                          <el-tooltip :content="'طريقة ادخال: ' + ByQTY" placement="top">
                            <el-switch
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              v-model="ByQTY"
                              active-value="الكمية"
                              inactive-value="عداد"
                            ></el-switch>
                          </el-tooltip>
                        </el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="24">
                          <el-input prop="Name" placeholder="اسم المستلم" v-model="tempForm.Name"></el-input>
                        </el-col>
                      </el-row>
                      <el-row type="flex" v-permission="['admin']">
                        <el-col
                          :span="6"
                          class="TotalAmmount"
                          style="font-size: medium"
                        >{{$t('NewPurchaseInvoice.TotalDiscount')}}</el-col>
                        <el-col :span="8">
                          <el-input-number
                            prop="Discount"
                            v-model="tempForm.Discount"
                            controls-position="right"
                            :precision="2"
                            :step="1"
                            :min="0.00"
                            :max="100"
                          ></el-input-number>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item prop="Tax">
                            <el-select v-model="tempForm.Tax" v-bind:placeholder="$t('Items.Tax')">
                              <el-option
                                v-for="tax in TaxOptions"
                                :key="tax.value"
                                :label="tax.label"
                                :value="tax.value"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="24" class="TotalAmmount">
                          <span>{{ $t('NewPurchaseInvoice.TotalJD') }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span>{{(tempForm.InventoryMovements.reduce(function(prev, cur) {return prev + cur.Qty * cur.SellingPrice;}, 0) - tempForm.Discount).toFixed(2)}} JOD</span>
                        </el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="24">
                          <el-form-item prop="Description">
                            <el-input
                              v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
                              v-model="tempForm.Description"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="6">
                          <el-button
                            style="font-size: 20px;"
                            @click="createData()"
                            type="success"
                            icon="el-icon-check"
                          ></el-button>
                        </el-col>
                        <el-col :span="6">
                          <el-button
                            style="font-size: 20px;"
                            @click="Print()"
                            type="primary"
                            icon="el-icon-printer"
                          ></el-button>
                        </el-col>
                      </el-row>
                    </el-card>
                  </template>
                  <template slot="paneR">
                    <el-form-item prop="InventoryMovements">
                      <el-table
                        border
                        :data="tempForm.InventoryMovements"
                        width="100%"
                        max-height="400"
                      >
                        <el-table-column prop="ItemsID" width="350" align="center">
                          <template
                            slot="header"
                            slot-scope="{}"
                          >{{ $t('NewPurchaseInvoice.Items') }} ({{tempForm.InventoryMovements.length.toFixed(2)}} )</template>
                          <template slot-scope="scope">
                            <div class="ItemName">
                              {{scope.row.Itemx.Name}}
                              <el-tag
                                type="success"
                                effect="plain"
                              >{{scope.row.Itemx.SellingPrice.toFixed(2)}}</el-tag>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column width="160" align="center">
                          <template
                            slot="header"
                            slot-scope="{}"
                          >{{ $t('NewPurchaseInvoice.quantity') }} ({{tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0),0 ).toFixed(2)}} )</template>
                          <template slot-scope="scope">
                            <el-input-number
                              controls-position="right"
                              v-model="tempForm.InventoryMovements[scope.$index].Qty"
                              :precision="2"
                              :step="1"
                              :min="0"
                              :max="1000000"
                            ></el-input-number>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-permission="['admin']"
                          v-bind:label="$t('NewPurchaseInvoice.Price')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <currency-input
                              class="currency-input"
                              v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-bind:label="$t('CashPool.Total')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <div
                              class="currency-input"
                            >JOD {{(tempForm.InventoryMovements[scope.$index].SellingPrice * tempForm.InventoryMovements[scope.$index].Qty).toFixed(2)}}</div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-permission="['admin']"
                          v-bind:label="$t('NewPurchaseInvoice.Inventory')"
                          width="110"
                          align="center"
                        >
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
                        <el-table-column label="#" align="center">
                          <template slot-scope="scope">
                            <el-button
                              type="danger"
                              icon="el-icon-delete"
                              @click="RemoveItem(scope.$index)"
                            ></el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </template>
                </split-pane>
              </template>
              <template slot="paneR">
                <el-tabs tab-position="left" type="border-card" style="background: #b2bec3">
                  <el-tab-pane
                    v-for="(Menu, Mindex) in MenuItems"
                    :key="Mindex"
                    :label="Menu.label"
                  >
                    <el-col
                      style="padding: 4px;"
                      :xs="8"
                      :sm="8"
                      :md="6"
                      :lg="4"
                      :xl="3"
                      v-for="(Item, index) in Items"
                      :key="index"
                    >
                      <el-card class="box-card" shadow="always" :body-style="{ padding: '6px' }">
                        <img src class="image" />
                        <div style="padding: 2px;" @click="AddItem(Item)">
                          <span>{{ Item.Name }}</span>
                          <div class="bottom clearfix">
                            <time class="time">{{ Item.SellingPrice.toFixed(2) }} JOD</time>
                            <span>{{Item.UnitName}}</span>
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </split-pane>
          </template>
        </split-pane>
      </div>
      <el-dialog
        style="margin-top: -13vh"
        :show-close="false"
        title="صنف جديد"
        :visible.sync="NewItemVisible"
        width="80%"
      >
        <el-row type="flex">
          <el-col :span="3">
            <el-button type="success" icon="el-plus" @click="NewItem()">حفظ</el-button>
          </el-col>

          <el-col :span="5">
            <el-form-item label="سعر البيع">
              <el-input-number
                v-model="SellingPrice"
                :precision="2"
                :step="0.1"
                :min="0.00"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="باركود">
              <el-input v-model="Barcode" suffix-icon="fa fa-barcode"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="إسم صنف">
              <el-input type="text" v-model="Name" placeholder="إسم صنف"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog style="margin-top: -13vh" title="QTY" :visible.sync="EnterQTYVisible" width="80%">
        <el-row type="flex">
          <el-col :span="3">
            <el-button type="success" icon="el-plus" @click="onBarcodeScanned(Barcode)">Add</el-button>
          </el-col>

          <el-col :span="12">
            <el-input-number v-model="Qty" :precision="2" :step="1" :min="0.00" :max="1000000"></el-input-number>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import permission from "@/directive/permission/index.js";
import printJS from "print-js";
import { Invoice1 } from "@/Report/POSInvoice";
import LangSelect from "@/components/LangSelect";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import { Create } from "@/api/SaleInvoice";
import { GetActiveInventory } from "@/api/InventoryItem";
import { GetActiveMenuItem } from "@/api/MenuItem";
import { GetActiveVendor } from "@/api/Vendor";
import { CreateItem, GetActiveItem } from "@/api/Item";

//import { GetActiveMember } from "@/api/Member";
import splitPane from "vue-splitpane";
//import { NumericInput } from "numeric-keyboard";

//import VueTouchKeyboard from "vue-touch-keyboard";
export default {
  name: "NewSaleInvoice",
  directives: { permission },
  components: { splitPane, LangSelect, Screenfull, SizeSelect, printJS },
  data() {
    return {
      OldInvoice: {},
      ByQTY: false,
      Qty: 1,
      SellingPrice: 0.0,
      NewItemVisible: false,
      EnterQTYVisible: false,
      Barcode: "",
      Name: "",
      tempForm: {
        ID: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorID: 1,
        IsPrime: 0,
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إكمال عملية البيع من غير إضافة أصناف",
            trigger: "change"
          }
        ]
      },
      TaxOptions: [
        {
          value: 0,
          label: "لا توجد ضريبة"
        },
        {
          value: 0.16,
          label: "ضريبة 16 %"
        }
      ],
      InventoryItems: [],
      MenuItems: [],
      Items: [],
      Vendor: []
    };
  },
  methods: {
    AddItem(Item) {
      var find = this.tempForm.InventoryMovements.findIndex(
        value => value.ItemsID == Item.ID
      );
      console.log(find);

      if (find != -1) this.tempForm.InventoryMovements[find].Qty += this.Qty;
      else {
        this.tempForm.InventoryMovements.push({
          ID: undefined,
          ItemsID: Item.ID,
          TypeMove: "Out",
          Status: 0,
          Qty: 1.0,
          SellingPrice: Item.SellingPrice,
          Tax: 0.0,
          Description: "",
          InventoryItemID: 1,
          Itemx: Item,
          SalesInvoiceID: undefined
        });
      }
      this.Barcode = "";
      this.Name = "";
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
    },
    SearchNameItem(queryString, cb) {
      var Items = this.Items;
      var responses = queryString
        ? Items.filter(this.createFilter(queryString))
        : Items;
      if (responses.length <= 0) {
        // console.log(responses.length);
        this.NewItemVisible = true;
      } else {
        this.NewItemVisible = false;
      }
      // call callback function to return suggestion objects
      cb(responses);
    },
    createFilter(queryString) {
      return Item => {
        return Item.Name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    show(e) {
      this.input = e.target;
    },
    getdata() {
      const loading = this.$loading({
        lock: true,
        text: "تحميل",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      GetActiveInventory().then(response => {
        console.log(response);
        this.InventoryItems = response;
      });
      GetActiveMenuItem().then(response => {
        console.log(response);
        this.MenuItems = response;
      });
      GetActiveItem().then(response => {
        console.log(response);
        this.Items = response;
      });
      GetActiveVendor().then(response => {
        console.log(response);
        this.Vendor = response;
        loading.close();
      });
    },
    createData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          this.tempForm.PaymentMethod = this.tempForm.PaymentMethod;
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          this.tempForm.Name =
            this.tempForm.Name == "" ? " " : this.tempForm.Name;
          if (
            this.tempForm.InventoryMovements.reduce(function(prev, cur) {
              return prev + cur.Qty * cur.SellingPrice;
            }, 0) -
              this.tempForm.Discount >
              0 &&
            this.tempForm.InventoryMovements.length > 0 &&
            this.tempForm.InventoryMovements.reduce(
              (a, b) => a + (b["Qty"] || 0),
              0
            ) > 0
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
                    this.Print();
                    //   Object.assign(this.$data, this.$options.data());
                    this.getdata();
                  }
                });
              })
              .catch(error => {
                console.log(error);
              });
          } else
            this.ValidateDescription =
              "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    NewItem() {
      CreateItem({
        ID: undefined,
        Name: this.Name,
        CostPrice: 0.0,
        SellingPrice: this.SellingPrice,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        Barcode: this.Barcode,
        Description: "",
        IsPrime: 0
      })
        .then(response => {
          this.Barcode = "";
          this.NewItemVisible = false;
          this.getdata();
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    onBarcodeScanned(barcode) {
      if (this.ByQTY && this.Qty == 1) {
        this.EnterQTYVisible = true;
        this.Qty = 1;
      } else {
        var find = this.Items.findIndex(value => value.Barcode == this.Barcode);
        console.log(find);
        if (find != -1) {
          if (this.Qty > 1) {
            this.EnterQTYVisible = false;
            this.AddItem(this.Items[find]);
            this.Qty = 1;
          } else this.AddItem(this.Items[find]);
        } else {
          this.NewItemVisible = true;
        }
      }
    },
    // Reset to the last barcode before hitting enter (whatever anything in the input box)
    resetBarcode() {
      //  console.log("10");
      let barcode = this.$barcodeScanner.getPreviousCode();
      // do something...
    },
    Print() {
      printJS({
        printable: Invoice1(this.tempForm),
        type: "pdf",
        base64: true
      });
    }
  },
  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
    this.getdata();
  }
};
</script>
    <style scoped>
.ItemName {
  color: #009688;
  font-weight: 600;
  font-size: x-large;
}
.el-card__body {
  padding: 3px;
}
.components-container {
  position: relative;
  height: 100vh;
  margin: 0px 0px;
}
.time {
  font-size: 16px;
  color: #2f3542;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.container {
  border-style: double;
  text-align: center;
  font-size: x-large;
  font-weight: 500;
  color: mediumseagreen;
}
.right-menu-item {
  color: #ffffff;
  display: inline-block;
  padding: 0 8px;
  font-size: 18px;
  vertical-align: text-bottom;
}
.TotalAmmount {
  font-size: x-large;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}
.el-form-item__label {
  color: white;
}
</style>
