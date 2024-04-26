let options = document.getElementById('options');
let search_mode = document.getElementById('search_mode');
let result_div = document.getElementById('result');
let reward_btn = document.getElementById('reward_btn');

console.log('sedn')
fetch('/api/customers?' + new URLSearchParams({ "key": 'tag', 'value': '', 'ambiguous': 1, 'mask': ['tag', 'name', 'table_num', 'present'] }), { method: 'get', headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json())
    .then(data => {
        const tags = new Set();
        data[0].forEach(customer => {
            if (Array.isArray(customer.tag)) {
                customer.tag.forEach(tag => {
                    if (typeof tag === 'string' && tag.trim() !== '') {
                        tags.add(tag);
                    }
                });
            } else if (typeof customer.tag === 'string' && customer.tag.trim() !== '') {
                tags.add(customer.tag);
            }
        });
        const uniqueTags = Array.from(tags);
        console.log(uniqueTags);
        uniqueTags.forEach(tag => {
            options.innerHTML += `<option value="${tag}">${tag}</option>`;
        });
    });

reward_btn.addEventListener('click', () => {
    let tag = options.value;
    let mode = search_mode.value;
    console.log(tag);
    console.log(mode);
    fetch('/api/customers?' + new URLSearchParams({ "key": 'tag', 'value': tag, 'ambiguous': 1, 'mask': ['tag', 'name', 'table_num', 'present'] }), { method: 'get', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then(data => {
            console.log(data[0]);
            result_div.innerHTML = "";
            if (tag != '請選擇標籤') {
                data[0].forEach(customer => {
                    if (customer.present == "已簽到") {
                        result_div.innerHTML += `
                            <tr class="table-success">
                                <th scope="row">-</th>
                                <td>${customer.name}</td>
                                <td>${customer.table_num}</td>
                                <td>${customer.tag}</td>
                                <td>${customer.present}</td>
                            </tr>`;
                    } else if (customer.present != "已簽到" && mode != 'present') {
                        result_div.innerHTML += `
                            <tr class="table-danger">
                                <th scope="row">-</th>
                                <td>${customer.name}</td>
                                <td>${customer.table_num}</td>
                                <td>${customer.tag}</td>
                                <td>尚未簽到</td>
                            </tr>`;
                    }
                });
                document.getElementById('rewardModal_button').click();
            }
            else {
                alert("請選擇標籤");
            }
        });

});




