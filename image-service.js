const { Image } = require("./models/image");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dk9m0hgxp",
  api_key: "474467435976891",
  api_secret: "P6vdoEG6yOuTSRFWyoLaW61HNBQ",
});


function uploadImage(formdata) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      formdata,
      (options = {
        overwrite: true,
      }),
      (error, result) => {
        if (result) {
          new Image({
            publicId: result.public_id,
            imageUrl: result.url,
          })
            .save()
            .then((data) => resolve(data.imageUrl));
        } else {
          reject(error);
        }
      }
    );
  });
}

function deleteImage(url) {
    Image.findOneAndDelete({ imageUrl: url })
    .then((result) => cloudinary.v2.uploader.destroy(result.publicId))
    .catch(error => console.log(error))
}

module.exports = {
  uploadImage,
  deleteImage,
};
