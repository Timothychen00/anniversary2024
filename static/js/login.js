login_btn = document.getElementById('login_btn');
login_btn.addEventListener('click', () => {
    if (document.getElementById('account').value === "" || document.getElementById('password').value === "") {
        alert("請輸入帳號密碼")
        return;
    }
    console.log('sedn')
    fetch('/login', {
        body: JSON.stringify({
            'username': document.getElementById('account').value,
            'password': document.getElementById('password').value,
        }), method: 'post', headers: { 'Content-Type': 'application/json' }
    })
        .then(res => (res.json()))
        .then(res => {
            if (res[0] == "login success") {
                window.location.href = "/employee"
            }
            else {
                alert("登入失敗")
            }
        })

});
