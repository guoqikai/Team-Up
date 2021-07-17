export function uploadImage(imageFormData, callback) {
  if (imageFormData.has("image")) {
    const postRequest = new Request("/api/image", {
      method: "post",
      body: imageFormData,
    });

    fetch(postRequest)
      .then((res) => {
        if (res.status === 200) {
          res.json().then((json) => {
            callback(json.url, true);
          });
        } else if (res.status >= 500) {
          throw new Error("Internal Server Error");
        } else {
          throw new Error("Client Error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    callback(null, true);
  }
}
