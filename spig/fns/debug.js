
module.exports = (file) => {
  console.log("-----");
  console.log("path:" + file.path);
  console.log("relative:" + file.relative);
  console.log("meta:" + JSON.stringify(file.meta));
};
