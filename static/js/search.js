var circle_position = {
    1: { x: 7, y: 90 },
    2: { x: 54, y: 115 },
    3: { x: 7, y: 139 },
    5: { x: 7, y: 190 },
    6: { x: 7, y: 239 },
    7: { x: 7, y: 290 },
    8: { x: 54, y: 164 },
    9: { x: 54, y: 265 },
    10: { x: 103, y: 293 },
    11: { x: 54, y: 215 },
    12: { x: 103, y: 143 },
    15: { x: 103, y: 193 },
    16: { x: 103, y: 243 },
    17: { x: 154, y: 215 },
    18: { x: 206, y: 240 },
    19: { x: 154, y: 265 },
    20: { x: 206, y: 290 },
    21: { x: 255, y: 269 },
    22: { x: 255, y: 219 },
    23: { x: 302, y: 195 },
    25: { x: 302, y: 245 },
    26: { x: 302, y: 295 },
    27: { x: 252, y: 210 },
    28: { x: 252, y: 260 },
    29: { x: 300, y: 86 },
    30: { x: 300, y: 134 },
    31: { x: 300, y: 185 },
    32: { x: 300, y: 235 },
    33: { x: 300, y: 286 },
    "主桌": { x: 154, y: 100 },
    "貴1": { x: 206, y: 140 },
    "貴2": { x: 154, y: 165 },
    "貴3": { x: 206, y: 190 },
    "師1": { x: 255, y: 119 },
    "師2": { x: 303, y: 95 },
    "師3": { x: 255, y: 169 },
    "家長會": { x: 303, y: 143 },
};
let searchElement = document.getElementById("search_input");
let predictresult = document.getElementById("predict_result");
let predict = document.getElementById("predict");
let resultDiv = document.getElementById("result");
let search_result = [];
let resultList = [];
let table_num_list = [];
let user_input_display = document.getElementById("user_input_display");
let specific_value = 0;

var SignalController = new Array();
var start_time = 0;
var timesss = 0


function fetchSearchResult(key, value, ambiguous, borter = null) {
    clear();
    resultList = [];
    //borter
    borter_signal = null;
    if (borter)
        borter_signal = borter.signal;

    return fetch('/api/customers?' + new URLSearchParams({ 'key': key, 'value': value, 'ambiguous': ambiguous, 'mask': ['_id', 'table_num', 'name', 'table_owner', 'year'] }), { method: 'get', headers: { 'Content-Type': 'application/json' }, signal: borter_signal })
        .then(response => { console.log(response); console.log(new Date().getTime()); return response.json() })
        .then(data => {
            if (table_num_list.length != 1) {
                if (data.length == 2) {
                    for (let i = 0; i < data[0].length; i++) {
                        let result = data[0][i];
                        if (!resultList.some(item => item.key === key && item.value === result[key])) {
                            resultList.push({ key: key, value: result[key] });
                        }
                    }
                    // console.log('resultList', resultList, resultList.length);
                }
                else {
                    if (data[0].length > 0 || data[1].length > 0 || data[2].length > 0) {
                        let key_list = ['table_num', 'table_owner', 'name'];
                        for (let r = 0; r < 3; r++) {
                            for (let i = 0; i < data[r].length; i++) {
                                let result = data[r][i];
                                if (!resultList.some(item => item.key == key_list[r] && item.value == result[key_list[r]] && item.table_num == result.table_num)) {
                                    resultList.push({ key: key_list[r], value: result[key_list[r]], id: result['_id'], table_num: result.table_num });
                                }
                            }
                        }
                    }
                }
            }
            else {
                resultList = table_num_list;
                data = [table_num_list, 'SUCCESS'];
            }
            console.log('data >', data);
            console.log('table_num_list >', table_num_list);
            console.log('resultList >', resultList);

            // Use the key and value as needed
            if (resultList.length > 1) {
                user_input_display.innerHTML = "";
                let predict = document.getElementById("predict");
                predict.style.display = "block";
                predictresult.innerHTML = "";
                for (let i = 0; i < resultList.length; i++) {
                    let title;
                    if (resultList[i].key === 'table_num') {
                        title = "桌號";
                    }
                    else if (resultList[i].key === 'table_owner') {
                        title = "桌長";
                    }
                    else if (resultList[i].key === 'name') {
                        title = "賓客";
                    }

                    let table_num;
                    if (resultList[i].value == resultList[i].table_num) {
                        table_num = "同上";
                    }
                    else {
                        if (hasChinese(String(resultList[i].table_num))) {
                            table_num = resultList[i].table_num;

                        }
                        else {
                            table_num = "桌" + resultList[i].table_num;
                        }
                    }

                    predictresult.innerHTML += `<button onclick="click_predict_selection('${resultList[i].id}','${resultList[i].value}')" class="btn btn-outline-dark d-inline-flex align-items-center pe-0 mt-2 ms-2 fw-300 position-relative" style="border: 2px solid black !important;; border-radius:1.2rem;font-size:25px;min-width:245px; !important; ">
                                                ${title} : ${resultList[i].value} <span class=" ms-2  mb-1 align-self-end" style="font-size: 15px;">
                                                <b>${table_num}</b></span> <ion-icon name="chevron-forward-outline" class="ms-2 me-0 position-absolute end-0" style="font-size: 34px;"></ion-icon></button>`;
                    // if (i + 1 < resultList.length) {
                    //     if (resultList[i].value == resultList[i + 1].value) {
                    //         console.log('same');
                    //         predict.style.display = "none";
                    //         predictresult.innerHTML = "";
                    //         user_input_display.innerHTML = '<h4 class="text-center mt-3 text-secondary">搜尋結果：' + document.getElementById("search_input").value + '</h4>'
                    //         resultList = [{ key: resultList[i].key, value: resultList[i].value }];
                    //     }
                    // }
                }
            }
            console.log('after filter >', resultList);
            if (resultList.length == 1) {
                if (window)
                    if (specific_value == 0) {
                        document.getElementById("search_input").value = resultList[0].value;
                    }
                    else {
                        document.getElementById("search_input").value = specific_value;
                    }

                if (resultList.length > 0) {
                    window.last_length = resultList[0].value.length;
                }
                for (let i = 0; i < data.length - 1; i++) {
                    if (data[i].length > 0) {
                        search_result = data[i][0];
                    }
                }
                console.log('search_result >', search_result);
                if (specific_value == 0) {
                    user_input_display.innerHTML = '<h4 class="text-center mt-3 text-secondary">搜尋結果：' + document.getElementById("search_input").value + '</h4>'
                }
                else {
                    user_input_display.innerHTML = '<h4 class="text-center mt-3 text-secondary">搜尋結果：' + specific_value + '</h4>'
                }


                let resultDiv = document.getElementById("result");
                resultDiv.innerHTML = `
                        <div class="d-${window.innerWidth <= 768 ? 'flex' : ''} justify-content-between align-items-center mb-3">
                            <div class="row align-items-center">
                                <div class="">
                                    <div class="row align-items-center time-text mt-2 mx-auto">
                                        <div class="card bg-c-blue order-card col mb-1" style="min-height:100px;max-height:100px;min-width:70px !important;">
                                            <div class="card-block ">
                                                <h6 style="font-size:14px">桌號</h6>
                                                <h2 class="text-right"><span>`+ search_result.table_num + `</span></h2>
                                            </div>
                                        </div>
                                        <div class="card bg-c-green order-card col ms-md-3 ms-2" style="min-height:100px;max-height:100px;min-width:135px !important;">
                                            <div class="card-block">
                                                <h6 class="">桌長</h6>
                                                <h2 class="text-right"><span>`+ search_result.table_owner + `</span></h2>
                                            </div>
                                        </div>
                                        <div class="card bg-c-yellow order-card  col ms-md-3 ms-2"  style="min-height:100px;max-height:100px;min-width:105px !important;">
                                            <div class="card-block">
                                                <h6 class="">畢業年</h6>
                                                <h2 class="text-right"><span>`+ search_result.year + `</span></h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                function createMarker(x, y) {
                    document.getElementById('table_image').style.display = "block";
                    var div = document.createElement('div');
                    div.className = 'marker animate__animated animate__flash animate__infinite'; div.style.left = x + 'px'; div.style.top = y + 'px'; div.id = 'marker';
                    document.getElementById('table_image').appendChild(div);
                }
                createMarker(circle_position[search_result.table_num].x, circle_position[search_result.table_num].y)
            }
        }
            // else {
            //     predict = document.getElementById("predict");
            //     predict.style.display = "none";
            //     resultDiv = document.getElementById("result");
            //     resultDiv.innerHTML = '<h3 class="text-center text-danger mt-5 mb-5 ">查無資料</h3>';
            // }
        )
};

function fetchSearchTable_Num(value, borter = null) {
    borter_signal = null;
    if (borter)
        borter_signal = borter.signal;

    fetch('/api/customers?' + new URLSearchParams({ "key": 'table_num', 'value': value, 'ambiguous': 0, 'mask': ['_id', 'table_num', 'name', 'table_owner', 'year'] }), { method: 'get', headers: { 'Content-Type': 'application/json', signal: borter_signal } })
        .then(res => (res.json()))
        .then(data => {
            table_num_list = [];
            for (let i = 0; i < data[0].length; i++) {
                let result = data[0][i];
                if (!table_num_list.some(item => item.table_num == result['table_num'])) {
                    table_num_list.push({ key: 'table_num', value: result.table_num, table_num: result.table_num, name: result.name, table_owner: result.table_owner, year: result.year });
                }
            }
        });
}


function search(event) {
    clear();
    if (searchElement.value === "" || searchElement.value === " ") {
        return;
    }
    else {
        if (event.inputType != 'deleteContentBackward' && event.inputType != 'deleteCompositionText') {

            for (i in SignalController)
                for (j in SignalController[i])
                    SignalController[i][j].abort();

            SignalController = new Array();
            SignalController.push([new AbortController(), new AbortController()]);
            console.log(SignalController);
            aborter1 = SignalController[SignalController.length - 1][0];
            aborter2 = SignalController[SignalController.length - 1][1];

            fetchSearchTable_Num(searchElement.value, aborter = aborter1);
            fetchSearchResult(['table_num', 'table_owner', 'name'], [searchElement.value, searchElement.value, searchElement.value], [1, 1, 1], aborter = aborter2);
        }
    }
}

function click_predict_selection(id, value) {
    console.log(id);
    console.log(value);
    clear();
    fetchSearchTable_Num(searchElement.value, aborter = aborter1);
    fetchSearchResult(['_id'], [id], [0], aborter = aborter2);
    specific_value = value;
}


function clear() {
    user_input_display.innerHTML = "";
    predictresult.innerHTML = "";
    predict.style.display = "none";
    resultDiv.innerHTML = "";
    search_result = [];
    resultList = [];
    specific_value = 0;
    document.getElementById('table_image').style.display = "none";
    try {
        document.getElementById("marker").remove();
    } catch (e) {
    }
}

function hasChinese(str) {
    return /[\u4E00-\u9FA5]+/g.test(str)
}

searchElement.addEventListener('input', (event) => search(event));
document.getElementById("search_button").addEventListener('click', (event) => search(event));
