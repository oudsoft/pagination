import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import "./Pagination.css";

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr key={props.key} >
        <td key={props.key} align="center">{props.key}</td>
        <td key={props.key} align="left">{props.content}</td>
      </tr>
    )
  }
}


const Pagination = (/* { value } */ ) => {

  let curPage = 1;
  let ipp = 2;
  let maxPage = 10;
  let from = 1;
  let to = 10;

  const [contents, setContents] = useState([{key: 1, content: 'This Content #1'}]);

  const doAddContents = function() {
    let conts = [];
    for (let i=0; i <= 150; i++) {
      conts.push({key: (i+1), content: 'This Content #' + (i+1)});
    }
    return conts;
  }

  useEffect(() => {
    let constData = doAddContents();
    setContents(constData);
    console.log(constData);
    document.getElementById('CurPage').value = curPage;
  }, []);

  const doGoToFirst = function(evt) {
    curPage = 1;
    document.getElementById('CurPage').value = curPage;
    console.log(curPage);
  }

  const doGoToPrev = function(evt) {
    if ((curPage <= maxPage) && (curPage >= 1)) {
      curPage = curPage - 1;
      document.getElementById('CurPage').value = curPage;
      console.log(curPage);
    }
  }

  const doGoToNext = function(evt) {
    if ((curPage <= maxPage) && (curPage >= 1)) {
      curPage = curPage + 1;
      document.getElementById('CurPage').value = curPage;
      console.log(curPage);
    }
  }

  const doGoToLast = function(evt) {
    curPage = maxPage;
    document.getElementById('CurPage').value = curPage;
    console.log(curPage);
  }

  const doSetPage = function(evt){
    let goto = evt.target.value;
    if ((goto !== '') && (Number(goto) > 0) && (goto <= maxPage)) {
      curPage = goto;
    }
  }

  const doSetItemPerPage = function(evt){
    ipp = evt.target.value;
    console.log(ipp);
    curPage = 1;
    document.getElementById('CurPage').value = curPage;
    console.log({ipp, curPage});
  }

  return (
    <div className="PaginationMain">
      <input type="button" value="First" onClick={doGoToFirst}/>
      <input type="button" value="Prev" onClick={doGoToPrev}/>

      <input id="CurPage" type="number" style={{width: '50px', marginLeft: '10px'}} onChange={doSetPage}/>
      <label style={{marginLeft: '10px'}}> / 10</label>
      <select style={{marginLeft: '10px'}} onChange={doSetItemPerPage}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value="70">70</option>
        <option value="100">100</option>
      </select>

      <input type="button" value="Next" onClick={doGoToNext} style={{marginLeft: '10px'}}/>
      <input type="button" value="Last" onClick={doGoToLast}/>

      <div>

        {/* <ContentTable from={1} to={4} /> */}
        <table cellPadding="1" cellSpacing="1" border="1" width="100%">
          <tbody>
            <tr id="header-row">
              <td width="5%" align="center">#</td>
              <td width="*" align="center">Name</td>
            </tr>
            /*
            <tr id="data-row">
            {
              ( () => {
                console.log(contents);
                console.log(contents.length);
                if (contents.length > 0) {
                  let tr = [];
                  for (let i = 0; i < 2; i++) {
                    if (contents[i]) {
                      let content = contents[i];
                      console.log(content);
                      //tr.push(<tr id="data-row">);
                      tr.push(<td>{content.key}</td>);
                      tr.push(<td>{content.content}</td>);
                      //tr.push(</tr>);
                    }
                  }
                  return tr;
                }
              })()
            }
            </tr>
            */
            <Row key={constents.key} content={contents.content}/>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pagination;
