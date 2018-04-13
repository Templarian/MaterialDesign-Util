const fs = require('fs');

const encoding = "utf8";
const folder = `${__dirname}/../svg`;

exports.getVersion = () => {
  const file = fs.readFileSync(`${folder}/package.json`, { encoding });
  return JSON.parse(file).version;
};

exports.getMeta = (withPaths) => {
  const file = fs.readFileSync(`${folder}/meta.json`, { encoding });
  const meta = JSON.parse(file);
  if (withPaths) {
    const total = meta.length;
    meta.forEach((icon, i) => {
      const svg = fs.readFileSync(`${folder}/svg/${icon.name}.svg`, { encoding });
      icon.path = svg.match(/d="([^"]+)"/)[1];
    });
  }
  return meta;
};

exports.write = (file, data) => {
  fs.writeFileSync(file, data);
};

exports.read = (file, data) => {
  fs.readFileSync(file);
};

exports.exists = (file) => {
  return fs.exists(file);
};
