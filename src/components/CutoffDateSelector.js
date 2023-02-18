import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import "./CutoffDateSelector.css";

//import EarningTable from "./components/EarningTable";

const findCutoffDateFromDateOption = function(dUnit) {
  let d = dUnit.substring(0, dUnit.length - 1);
  let u = dUnit.substring(dUnit.length - 1);
  let now = new Date();
  if (u === 'D') {
    return now.setDate(now.getDate() - parseInt(d));
  } else if (u === 'M') {
    return now.setMonth(now.getMonth() - parseInt(d));
  } else if (u === 'Y') {
    return now.setFullYear(now.getFullYear() - parseInt(d));
  }
}

const doFormatDateStr = function(d) {
  var yy, mm, dd;
  yy = d.getFullYear();
  if (d.getMonth() + 1 < 10) {
    mm = '0' + (d.getMonth() + 1);
  } else {
    mm = '' + (d.getMonth() + 1);
  }
  if (d.getDate() < 10) {
    dd = '0' + d.getDate();
  } else {
    dd = '' + d.getDate();
  }
  var td = `${yy}-${mm}-${dd}`;
  return td;
}

const doFormatNumber = function(num){
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  return Number(num).toLocaleString('en', options);
}

const doCreateLoadingTrigger = function(action) {
  let moveEvent = new CustomEvent('loading-trigger', { detail: {action: action }, bubbles: true });
  document.dispatchEvent(moveEvent);
}

const CutoffDateSelector = ({ value }) => {

  let sumInBefore = 0;
  let sumOutBefore = 0;
  let sumInAfter = 0;
  let sumOutAfter = 0;

  let earnData = {sumInBefore, sumOutBefore, sumInAfter, sumOutAfter};

  const [earn, setEarn] = useState(earnData);
  const [cutoff, setCutoff] = useState('');

  const doLoadEarn = function(cutoff) {
    return new Promise(async function(resolve, reject) {
      doCreateLoadingTrigger('start');
      let shopData = JSON.parse(localStorage.getItem('earnShopData'));
      let cutoffDateValue = undefined;
      if (cutoff) {
        cutoffDateValue = cutoff;
      } else {
        cutoffDateValue = '1D';
      }
      let cutoffDate = findCutoffDateFromDateOption(cutoffDateValue);
      let orderDateFmt = doFormatDateStr(new Date(cutoffDate));

      //console.log(orderDateFmt );

      setCutoff(orderDateFmt);

      cutoffDate = new Date(cutoffDate);
      let params = {cutoffDate: cutoffDate};
      let stockCutoffUrl = '/api/shop/stocking/summary/' + shopData.id;

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      axios.post(stockCutoffUrl, params).then((response) => {
        sumInBefore = 0;
        sumOutBefore = 0;
        sumInAfter = 0;
        sumOutAfter = 0;
        let earnResults = response.data.results;
        for (let i=0; i < earnResults.length; i++) {
          sumInBefore = sumInBefore + earnResults[i].Before.AmountIn;
          sumOutBefore = sumOutBefore + earnResults[i].Before.AmountOut;
          sumInAfter = sumInAfter + earnResults[i].After.AmountIn;
          sumOutAfter = sumOutAfter + earnResults[i].After.AmountOut;
        }
        earnData = {sumInBefore, sumOutBefore, sumInAfter, sumOutAfter};
        resolve(earnData);
        doCreateLoadingTrigger('stop');
      });
    });
  }

  const changeCutoffDate = async function(evt) {
    let earnData = await doLoadEarn(evt.target.value);
    setEarn(earnData);
  }

  useEffect(async () => {
    let earnData = await doLoadEarn();
    setEarn(earnData);
  }, []);

  return (
    <>
      <div className="CutoffDateSelectorMain">
        <div className="CutoffDateSelectorLabel1">
          <span>เมื่อ</span>
        </div>
        <div className="CutoffDateSelectorValue">
          <select id="CutoffDateSelector" onChange={changeCutoffDate}>
            <option value="1D">1 วัน</option>
            <option value="2D">2 วัน</option>
            <option value="3D">3 วัน</option>
            <option value="4D">4 วัน</option>
            <option value="5D">5 วัน</option>
            <option value="7D">7 วัน</option>
            <option value="10D">10 วัน</option>
            <option value="15D">15 วัน</option>
            <option value="20D">20 วัน</option>
            <option value="1M">1 เดือน</option>
            <option value="2M">2 เดือน</option>
            <option value="3M">3 เดือน</option>
            <option value="5M">5 เดือน</option>
            <option value="6M">6 เดือน</option>
            <option value="1Y">1 ปี</option>
          </select>
        </div>
        <div className="CutoffDateSelectorLabel2">
          <span>ที่แล้ว</span>
        </div>
      </div>
      <div className="EarningTableBox">
        <table width="100%" cellpadding="2" cellspacing="0" border="1">
          <tr style={{'background-color': '#ddd'}}>
            <td width="30%" align="left">จำนวนเงิน (บาท)</td>
            <td width="22%" align="center"><b>ก่อน {cutoff}</b></td>
            <td width="22%" align="center"><b>หลัง {cutoff}</b></td>
            <td width="*" align="center"><b>รวม</b></td>
          </tr>
          <tr>
            <td align="left">จำหน่ายสินค้า (ออก)</td>
            <td align="right"><b>{doFormatNumber(earn.sumOutBefore)}</b></td>
            <td align="right"><b>{doFormatNumber(earn.sumOutAfter)}</b></td>
            <td align="right" style={{'background-color': '#ddd'}}><b>{doFormatNumber(earn.sumOutBefore + earn.sumOutAfter)}</b></td>
          </tr>
          <tr>
            <td align="left">สต็อคสินค้า (เข้า)</td>
            <td align="right"><b>{doFormatNumber(earn.sumInBefore)}</b></td>
            <td align="right"><b>{doFormatNumber(earn.sumInAfter)}</b></td>
            <td align="right" style={{'background-color': '#ddd'}}><b>{doFormatNumber(earn.sumInBefore + earn.sumInAfter)}</b></td>
          </tr>
          <tr style={{'background-color': '#ddd'}}>
            <td align="left"><b>กำไร-ขาดทุน (สุทธิ)</b></td>
            <td align="right"><b>{doFormatNumber(earn.sumOutBefore - earn.sumInBefore)}</b></td>
            <td align="right"><b>{doFormatNumber(earn.sumOutAfter - earn.sumInAfter)}</b></td>
            <td align="right"><b>{doFormatNumber((earn.sumOutBefore - earn.sumInBefore) + (earn.sumOutAfter - earn.sumInAfter))}</b></td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default CutoffDateSelector;

// https://stackoverflow.com/questions/30716421/react-select-onchange-is-not-working

// https://www.pluralsight.com/guides/creating-dynamic-editable-tables-with-reactjs
