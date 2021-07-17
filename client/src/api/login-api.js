const { initMessageClient, closeWs } = require("./message-api")

let user = null;

export function getCurrentUserInfoNonBlocking() {
    return user;
}

//callback: (data, authorized)

export function getCurrentUserInfo(callback) {    
    if (user) {
        callback(user, true);
    }
    else {
        const request = new Request("/api/login", {
            method: "GET",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        fetch(request)
            .then(res => {
                if (res.status === 200) {
                    res.json().then((body) => {
                        user = body
                        initMessageClient();
                        callback(body, true);
                    });
                }
                else {
                    callback(null, false);
                }
            })
            .catch(error => {
                console.log(error);
                callback(null, false);
        });
    }
}

export function login(info, callback) {
    const request = new Request("/api/login", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                res.json().then((body) => {
                    initMessageClient();
                    user = body;
                    callback(body, true);
                });
            }
            else if (res.status === 400) {
                callback("The email or password is incorrect.", false);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export function register(info, callback) {
    const request = new Request("/api/register", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                res.json().then((body) => {
                    initMessageClient();
                    user = body;
                    callback(body, true);
                });
            }
            else {
                res.json().then((body) => callback(body, false));
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export function logoutUser() {
    const request = new Request("/api/logout", {
        method: "GET",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    fetch(request).then(() => {
        closeWs();
        window.location.reload();
    }).catch(error => console.log(error));
}