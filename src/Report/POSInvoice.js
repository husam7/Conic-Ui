import  jsPDF from "jspdf"
import AmiriRegular from "@/store/FontVFS";
import { GetCompanyInfo } from "@/api/CompanyInfo";
var ComapnyInfo = null;
GetCompanyInfo().then(response => {
  ComapnyInfo = response;
})
export function Invoice1(temp) {
    let doc = new jsPDF("p", "mm", "80", { filters: ["ASCIIHexEncode"] });

    var timein = new Date(temp.FakeDate);
    var timeout = new Date(temp.FakeDate);
    var ItemQty = temp.InventoryMovements.reduce(
      (a, b) => a + (b["Qty"] || 0),
      0
    ).toFixed(2);
    var TotalAmmount = (
      temp.InventoryMovements.reduce(function(prev, cur) {
        return prev + cur.Qty * cur.SellingPrice;
      }, 0) - temp.Discount
    ).toFixed(2);
    // timeout.setMinutes(timeout.getMinutes() + temp.HourCount * 60);
    doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    //Logo
    doc.addImage(ComapnyInfo.Logo, "jpeg", 2, 0, 14, 14);
    //Name

    doc.setFontSize(24);
    doc.setFontType("normal");
    doc.text(ComapnyInfo.Name, 26, 9);

    doc.setFontSize(12);

    doc.text(":رقم طلب", 55, 20);
    doc.text("" + temp.ID + "", 5, 20);

    doc.text(":عدد الاصناف", 50, 34);
    doc.text("" + ItemQty + "", 5, 34);


    doc.text(": (JOD) المبلغ الاجمالي", 30, 62);
    doc.text(" " + TotalAmmount + "  ", 5, 62);

    doc.setLineWidth(1);
    doc.line(0, 67, 80, 67);
    doc.text(" :تاريخ الزيارة", 52, 78);
    doc.text("" + formatDate(timein, "no") + " - "+tConvert(timein), 5, 78);

    doc.setLineWidth(1);
    doc.line(0, 80, 80, 80);


   return doc.output('datauri').replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')

  }

  export function tConvert(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = " " + hours + ":" + minutes + "  " + ampm;
    return strTime;
  }

  export function formatDate(date) {
    var d = new Date(date),
      day = "" + d.getDate(),
      month = "" + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
  }