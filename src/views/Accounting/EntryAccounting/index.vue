﻿<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left"
          icon="el-icon-plus"
          to="/Accounting/NewAccountingEntry"
        >{{ $t('Accounting.NewAccountingEntry') }}</router-link>

        <span>{{ $t('Accounting.AccountingEntryinquiries') }}</span>
      </div>

      <div slot="header" class="clearfix">
        <span class="demonstration">{{ $t('Stocks.SearchBy') }}</span>
        <el-date-picker
          v-model="date"
          format="dd/MM/yyyy"
          type="daterange"
          align="left"
          unlink-panels
          v-bind:range-separator="$t('Sales.until')"
          v-bind:start-placeholder="$t('Sales.From')"
          v-bind:end-placeholder="$t('Sales.To')"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          style="width:80%"
          @change="changeDate"
        ></el-date-picker>
      </div>
      <el-card class="box-card">
        <span class="demonstration">{{ $t('Accounting.Account') }}</span>
        <el-select
          v-model="AccountID"
          filterable
          v-bind:placeholder="$t('Accounting.Account')"
          @change="changeDate"
          autocomplete="off"
        >
          <el-option
            v-for="(item , index) in this.Account"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-card>

      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        max-height="850"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column v-bind:label="$t('Accounting.EntryID')" prop="EntryID" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="success"
              icon="el-icon-refresh"
              @click="changeDate"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
         align="center"
          v-bind:label="$t('Stocks.Date')"
          prop="ActionLogs[0].PostingDateTime"
          width="120"
        ></el-table-column>

        <el-table-column v-bind:label="$t('Accounting.Notes')" prop="Description" align="center"></el-table-column>
        <el-table-column v-bind:label="$t('Accounting.Credit')" prop="Credit" width="100" align="center">
          <template slot-scope="scope">{{(scope.row.Credit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Accounting.Debit')" prop="Debit" width="100" align="center">
          <template slot-scope="scope">{{(scope.row.Debit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Accounting.funds')" align="center" width="90">
          <template slot-scope="scope">{{ (scope.row.Credit - scope.row.Debit).toFixed(3)}}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textOpration.OprationDescription"
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :rules="rulesOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item v-bind:label="$t('Inventory.OperationNote')" prop="Description">
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :type="textOpration.ClassName"
          @click="createOprationData()"
        >{{textOpration.OprationDescription}}</el-button>
      </div>
    </el-dialog>
  </div>
</template> 
<script>
import { GetEntryAccounting } from "@/api/EntryAccounting";
import { GetActiveAccounts } from "@/api/Account";
import { ChangeObjStatus } from "@/api/Oprationsys";

export default {
  name: "EntryAccounting",
  data() {
    return {
      tableData: [],
      Account: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      date: [],
      AccountID: 41,
      pickerOptions: {
        shortcuts: [
          {
            text: "قبل أسبوع",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "قبل شهر",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "قبل 3 أشهر",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "قبل 1 سنة",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: ""
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur"
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    this.date = [start, end];
    this.getdata(this.AccountID, start, end);
  },
  methods: {
    getdata(Accountid, datefrom, dateto) {
      this.loading = true;
      datefrom.setHours(0, 0, 0, 0);
      datefrom = JSON.parse(JSON.stringify(datefrom));
      dateto = JSON.parse(JSON.stringify(dateto));
      GetEntryAccounting({
        AccountID: Accountid,
        DateFrom: datefrom,
        DateTo: dateto
      }).then(response => {
        console.log(response);
        this.tableData = response;
        GetActiveAccounts().then(response => {
          // handle success
          console.log(response);
          this.Account = response;
          this.loading = false;
        });
      });
    },
    changeDate() {
      this.loading = true;
      this.getdata(this.AccountID, this.date[0], this.date[1]);
    },
    handleOprationsys(ObjID, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.ID;
      this.tempOpration.Description = "";
    },
    createOprationData() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatus({
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
            Description: this.tempOpration.Description
          })
            .then(response => {
              this.getdata();
              this.dialogOprationVisible = false;
              this.$notify({
                title: "تم  ",
                message: "تمت العملية بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
        }
      });
    }
  }
};
</script>