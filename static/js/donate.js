const donate_name_inputElement = document.getElementById("donate_name_input");
let select_status = 0;
donate_name_inputElement.addEventListener("input", (event) => {
    if (event.inputType != 'deleteContentBackward') {
        fetchSearchResult('name', donate_name_inputElement.value, 1);
        select_status = 0;
        console.log(select_status);
    }
    if (donate_name_inputElement.value === "") {
        let predictresult = document.getElementById("predict_result");
        let predict = document.getElementById("predict");
        predictresult.innerHTML = "";
        predict.style.display = "none";
    }
});


let resultList = [];
function fetchSearchResult(key, value, ambiguous) {
    if (value === "" || value === " ") {
        let predictresult = document.getElementById("predict_result");
        let predict = document.getElementById("predict");
        predictresult.innerHTML = "";
        predict.style.display = "none";
        return;
    }
    return fetch('/api/customers?' + new URLSearchParams({ "key": key, 'value': value, 'ambiguous': ambiguous, 'mask': ['_id', 'table_num', 'name', 'table_owner', 'year'] }), { method: 'get', headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(data => {
            let predictresult = document.getElementById("predict_result");
            let predict = document.getElementById("predict");
            predictresult.innerHTML = "";
            predict.style.display = "none";
            resultList = [];
            // console.log(data[0]);
            if (data[0].length > 0) {
                for (let i = 0; i < data[0].length; i++) {
                    let result = data[0][i];
                    if (!resultList.some(item => item.key === key && item.value === result[key])) {
                        resultList.push({ key: key, value: result[key] });
                    }
                }
                // Use the key and value as needed
                console.log(resultList);
                if (resultList.length > 1) {
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
                        predictresult.innerHTML += `<button class="btn btn-outline-secondary mt-2 ms-2" style="font-size:15px !important;" onclick="select_donate_name('${resultList[i].key}', '${resultList[i].value}', '0')"> ${title} : ${resultList[i].value}</button>`;
                    }
                }
                else if (resultList.length == 1) {
                    select_donate_name(resultList[0].key, resultList[0].value, 0)
                }
            }
        }
        );
}

function select_donate_name(key, value, ambiguous) {
    donate_name_inputElement.value = value;
    select_status = 1;
    let predictresult = document.getElementById("predict_result");
    let predict = document.getElementById("predict");
    predictresult.innerHTML = "";
    predict.style.display = "none";
    console.log(select_status);
}

const donate_btn = document.getElementById('donate_btn');
donate_btn.addEventListener('click', () => {
    if (select_status === 0) {
        alert("請選擇貴賓");
        return;
    }
    else if (document.getElementById('money').value === "") {
        alert("請輸入金額");
        return;
    }
    else {
        fetch('/api/customers', {
            body: JSON.stringify({
                'key': 'name',
                'value': donate_name_inputElement.value,
                'data': { "donate": document.getElementById('money').value },
            }), method: 'put', headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                if (data[1] == 'SUCCESS') {
                    alert("捐款成功");
                    window.location.href = '/donate';
                }
            })
    }
})