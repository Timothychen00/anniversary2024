const searchElement = document.getElementById("search_input");
var circle_position = {
    1: { x: 52, y: 108 },
    2: { x: 3, y: 131 },
    3: { x: 3, y: 183 },
    5: { x: 3, y: 234 },
    6: { x: 3, y: 285 },
    7: { x: 52, y: 158 },
    8: { x: 52, y: 258 },
    9: { x: 100, y: 287 },
    10: { x: 52, y: 208 },
    11: { x: 100, y: 135 },
    12: { x: 100, y: 186 },
    15: { x: 100, y: 237 },
    16: { x: 152, y: 208 },
    17: { x: 205, y: 234 },
    18: { x: 152, y: 258 },
    19: { x: 205, y: 284 },
    20: { x: 253, y: 263 },
    21: { x: 253, y: 213 },
    22: { x: 303, y: 188 },
    23: { x: 303, y: 238 },
    25: { x: 303, y: 288 },
    "主桌": { x: 152, y: 91 },
    "貴1": { x: 205, y: 132 },
    "貴2": { x: 152, y: 157 },
    "貴3": { x: 205, y: 184 },
    "師1": { x: 253, y: 110 },
    "師2": { x: 303, y: 86 },
    "師3": { x: 253, y: 162 },
    "家長會": { x: 303, y: 136 },
};

var start_time = 0;
var timesss = 0
let resultList = [];
function fetchSearchResult(key, value, ambiguous) {
    resultList = [];
    if (value === "" || value === " ") {
        let predictresult = document.getElementById("predict_result");
        let predict = document.getElementById("predict");
        predictresult.innerHTML = "";
        predict.style.display = "none";
        return;
    }

    console.log('start', new Date().getTime());
    return fetch('/api/customers?' + new URLSearchParams({ 'key': key, 'value': value, 'ambiguous': ambiguous, 'mask': ['_id', 'table_num', 'name', 'table_owner', 'year'] }), { method: 'get', headers: { 'Content-Type': 'application/json' } })
        .then(response => { console.log(response); console.log(new Date().getTime()); return response.json() })
        .then(data => {
            console.log('sedn');
            let predictresult = document.getElementById("predict_result");
            let predict = document.getElementById("predict");
            let resultDiv = document.getElementById("result");
            predictresult.innerHTML = "";
            predict.style.display = "none";
            if (data.length == 2) {
                for (let i = 0; i < data[0].length; i++) {
                    let result = data[0][i];
                    if (!resultList.some(item => item.key === key && item.value === result[key])) {
                        resultList.push({ key: key, value: result[key] });
                    }
                }
                console.log('resultList', resultList, resultList.length);
            }
            else {
                if (data[0].length > 0 || data[1].length > 0 || data[2].length > 0) {
                    let key_list = ['table_num', 'table_owner', 'name'];
                    for (let r = 0; r < 3; r++) {
                        for (let i = 0; i < data[r].length; i++) {
                            let result = data[r][i];
                            if (!resultList.some(item => item.key === key_list[r] && item.value === result[key_list[r]])) {
                                resultList.push({ key: key_list[r], value: result[key_list[r]] });
                            }
                        }
                    }
                }
            }

            // Use the key and value as needed
            // console.log(resultList);
            if (resultList.length > 1) {
                document.getElementById("user_input_display").innerHTML = "";
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
                        title = "貴賓";
                    }
                    let ambiguous_mode = 0;
                    predictresult.innerHTML += `<button class="btn btn-outline-secondary mt-2 ms-2" style="font-size:25px !important;" onclick="fetchSearchResult('${resultList[i].key}','${resultList[i].value}',${ambiguous_mode})"> ${title} : ${resultList[i].value}</button>`;
                    if (i + 1 < resultList.length) {
                        if (resultList[i].value == resultList[i + 1].value) {
                            console.log('same');
                            predict.style.display = "none";
                            predictresult.innerHTML = "";
                            let user_input_display = document.getElementById("user_input_display");
                            user_input_display.innerHTML = '<h4 class="text-center mt-3 text-secondary">搜尋結果：' + document.getElementById("search_input").value + '</h4>'
                            resultList = [{ key: resultList[i].key, value: resultList[i].value }];
                        }
                    }
                }
            }
            if (resultList.length == 1) {
                if (window)
                    document.getElementById("search_input").value = resultList[0].value;
                if (resultList.length > 0) {
                    window.last_length = resultList[0].value.length;
                }

                for (let i = 0; i < data.length; i++) {
                    if (data[i].length == 1) {
                        search_result = data[i][0];
                    }
                }
                if (data[0].length > 0) {
                    search_result = data[0][0];
                }

                let user_input_display = document.getElementById("user_input_display");
                user_input_display.innerHTML = '<h4 class="text-center mt-3 text-secondary">搜尋結果：' + document.getElementById("search_input").value + '</h4>'

                let resultDiv = document.getElementById("result");
                resultDiv.innerHTML = "";
                let newDiv = document.createElement("div");
                newDiv.classList.add("mt-3");
                // Rest of the code...
                newDiv.innerHTML = `
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
                const tableImage = document.createElement("img");
                tableImage.id = "LiuYiFeiImg";
                tableImage.src = "/static/img/table.png";
                tableImage.alt = "table";
                tableImage.style.width = "350px";
                tableImage.style.height = "350px";
                tableImage.style.display = "block";
                tableImage.style.margin = "0 auto";
                const imageDiv = document.createElement("div");
                imageDiv.appendChild(tableImage);
                imageDiv.id = "table_image";
                imageDiv.classList += "img text-center";
                newDiv.appendChild(imageDiv);
                resultDiv.appendChild(newDiv);
                function createMarker(x, y, divName) {
                    var div = document.createElement('div');
                    div.className = 'marker animate__animated animate__flash animate__infinite'; div.style.left = x + 'px'; div.style.top = y + 'px';
                    document.getElementById(divName).appendChild(div)
                }
                createMarker(circle_position[search_result.table_num].x, circle_position[search_result.table_num].y, 'table_image')
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



searchElement.addEventListener("input", (event) => {
    document.getElementById("result").innerHTML = "";
    if (searchElement.value === "" || searchElement.value === " ") {
        let predictresult = document.getElementById("predict_result");
        let predict = document.getElementById("predict");
        predictresult.innerHTML = "";
        predict.style.display = "none";
    }
    else {
        if (event.inputType != 'deleteContentBackward') {
            resultList = [];
            fetchSearchResult(['table_num', 'table_owner', 'name'], [searchElement.value, searchElement.value, searchElement.value], [0, 1, 1]);
        }
        else {
            document.getElementById("user_input_display").innerHTML = "";
            console.log('delete');
        }
    }
});
