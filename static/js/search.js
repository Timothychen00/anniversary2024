const searchElement = document.getElementById("search_input");
var circle_position = {
    1: { x: 11, y: 91 },
    2: { x: 11, y: 139 },
    3: { x: 11, y: 188 },
    5: { x: 11, y: 237 },
    6: { x: 11, y: 286 },
    7: { x: 58, y: 115 },
    8: { x: 58, y: 164 },
    9: { x: 58, y: 213 },
    10: { x: 58, y: 262 },
    11: { x: 105, y: 142 },
    12: { x: 105, y: 191 },
    15: { x: 105, y: 240 },
    16: { x: 105, y: 289 },
    17: { x: 156, y: 164 },
    18: { x: 156, y: 213 },
    19: { x: 156, y: 262 },
    20: { x: 207, y: 141 },
    21: { x: 207, y: 190 },
    22: { x: 207, y: 239 },
    23: { x: 207, y: 288 },
    25: { x: 254, y: 119 },
    26: { x: 254, y: 168 },
    27: { x: 254, y: 217 },
    28: { x: 254, y: 266 },
    29: { x: 303, y: 96 },
    30: { x: 303, y: 144 },
    31: { x: 302, y: 194 },
    32: { x: 302, y: 242 },
    33: { x: 302, y: 291 },
};

function fetchSearchResult(key, value ,ambiguous) {
    return fetch('/api/customers?' + new URLSearchParams({ "key": key, 'value': value, 'ambiguous': ambiguous, 'mask': ['_id', 'table_num', 'name', 'table_owner', 'year'] }), { method: 'get', headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data[0].length > 0) {
                search_result = data[0][0];
                const resultDiv = document.getElementById("result");
                resultDiv.innerHTML = "";
                const newDiv = document.createElement("div");
                newDiv.classList.add("mt-3");
                // Rest of the code...
                newDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex flex-row align-items-center">
                    <ion-icon name="information-circle" class="m-3" size="large" style="color: rgb(226, 135, 7);"></ion-icon>
                    <div class="d-flex flex-column">
                        <b>搜尋結果</b>
                        <div class="d-flex flex-row align-items-center time-text">
                            <b style="font-size:17px!important;font-weight:400;">桌號 : `+ search_result.table_num + `</b>
                            <span class="dots"></span>
                            <b style="font-size:17px!important;font-weight:400;">桌長 : `+ search_result.table_owner + ` </b>
                            <span class="dots"></span>
                            <b style="font-size:17px!important;font-weight:400;">畢業年 : `+ search_result.year + ` </b>
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
                imageDiv.classList.add("img");
                newDiv.appendChild(imageDiv);
                resultDiv.appendChild(newDiv);
                function createMarker(x, y, divName) {
                    var div = document.createElement('div');
                    div.className = 'marker animate__animated animate__flash'; div.style.left = x + 'px'; div.style.top = y + 'px';
                    document.getElementById(divName).appendChild(div)
                }
                createMarker(circle_position[search_result.table_num].x, circle_position[search_result.table_num].y, 'table_image')
            }
})
};



searchElement.addEventListener("change", (event) => {
    fetchSearchResult('table_num', searchElement.value,0);
    fetchSearchResult('table_owner', searchElement.value,1);
    fetchSearchResult('name', searchElement.value,1);
});