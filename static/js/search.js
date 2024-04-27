const searchElement = document.getElementById("search_input");
var circle_position = {
    1: { x: 5, y: 80 },
    2: { x: 5, y: 131 },
    3: { x: 5, y: 180 },
    5: { x: 5, y: 230 },
    6: { x: 5, y: 282 },
    7: { x: 52, y: 106 },
    8: { x: 52, y: 156 },
    9: { x: 52, y: 206 },
    10: { x: 52, y: 256 },
    11: { x: 99, y: 134 },
    12: { x: 99, y: 183 },
    15: { x: 99, y: 233 },
    16: { x: 100, y: 283 },
    17: { x: 152, y: 156 },
    18: { x: 152, y: 206 },
    19: { x: 152, y: 255 },
    20: { x: 204, y: 132 },
    21: { x: 204, y: 182 },
    22: { x: 204, y: 231 },
    23: { x: 204, y: 282 },
    25: { x: 252, y: 110 },
    26: { x: 252, y: 160 },
    27: { x: 252, y: 210 },
    28: { x: 252, y: 260 },
    29: { x: 300, y: 86 },
    30: { x: 300, y: 134 },
    31: { x: 300, y: 185 },
    32: { x: 300, y: 235 },
    33: { x: 300, y: 286 },
    "主桌": { x: 152, y: 91 }
};

let resultList = [];
async function fetchSearchResult(key, value, ambiguous) {
    if (value === "" || value === " ") {
        let predictresult = document.getElementById("predict_result");
        let predict = document.getElementById("predict");
        predictresult.innerHTML = "";
        predict.style.display = "none";
        return;
    }
    return await fetch('/api/customers?' + new URLSearchParams({ "key": key, 'value': value, 'ambiguous': ambiguous, 'mask': ['_id', 'table_num', 'name', 'table_owner', 'year'] }), { method: 'get', headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(data => {
            // console.log(key, value, ambiguous);
            let predictresult = document.getElementById("predict_result");
            let predict = document.getElementById("predict");
            let resultDiv = document.getElementById("result");
            // resultDiv.innerHTML = "";
            predictresult.innerHTML = "";
            predict.style.display = "none";
            // resultList = [];
            // console.log(data[0]);
            if (data[0].length > 0) {

                for (let i = 0; i < data[0].length; i++) {
                    let result = data[0][i];
                    if (!resultList.some(item => item.key === key && item.value === result[key])) {
                        resultList.push({ key: key, value: result[key] });
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
                        predictresult.innerHTML += `<button class="btn btn-outline-secondary mt-2 ms-2" style="font-size:25px !important;" onclick="fetchSearchResult('${resultList[i].key}', '${resultList[i].value}', '0')"> ${title} : ${resultList[i].value}</button>`;
                        if (i + 1 < resultList.length) {
                            if (resultList[i].value == resultList[i + 1].value) {
                                console.log('same');
                                predict.style.display = "none";
                                predictresult.innerHTML = "";
                                let user_input_display = document.getElementById("user_input_display");
                                user_input_display.innerHTML = '<h4 class="text-center mt-3 text-secondary">搜尋結果：' + document.getElementById("search_input").value + '</h4>'
                            }
                        }
                    }
                }
                else if (resultList.length === 1) {
                    // console.log(resultList[0].value)
                    if (window)
                        document.getElementById("search_input").value = resultList[0].value;
                    if (resultList.length > 0) {
                        window.last_length = resultList[0].value.length;
                    }
                    search_result = data[0][0];

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
                    tableImage.classList += "img-fluid mx-auto";
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
        })
};



searchElement.addEventListener("input", (event) => {
    (async () => {
        document.getElementById("result").innerHTML = "";
        if (event.inputType != 'deleteContentBackward') {
            resultList = [];
            await fetchSearchResult('table_num', searchElement.value, 0);
            await fetchSearchResult('table_owner', searchElement.value, 1);
            await fetchSearchResult('name', searchElement.value, 1);
        }
        else {
            document.getElementById("user_input_display").innerHTML = "";
            console.log('delete');
        }
        if (searchElement.value === "") {
            let predictresult = document.getElementById("predict_result");
            let predict = document.getElementById("predict");
            predictresult.innerHTML = "";
            predict.style.display = "none";
        }
        resultList = [];
    })();
    // if (searchElement.value === "") {
    //     let predictresult = document.getElementById("predict_result");
    //     let predict = document.getElementById("predict");
    //     predictresult.innerHTML = "";
    //     predict.style.display = "none";
    // }
});
