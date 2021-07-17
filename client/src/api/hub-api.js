export function loadMataData(page, pageNum, search, callback) {
    const path = page === "Projects" ? "project" : page === "People" ? "user" : "skill"; 
    const searchQuery = search ? "&search=" + search : "";
    const pageQuery =  "?page=" + pageNum;
    const request = new Request("/api/" + path + pageQuery + searchQuery, {
        method: "get",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                res.json().then((body) => {
                    callback(body);
                });
            }
            else {
                callback([]);
            }
        })
        .catch(error => {
            console.log(error);
            callback([]);
        });
}