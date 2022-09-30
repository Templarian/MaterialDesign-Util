const fs = require('fs');
const path = require('path');

const encoding = "utf8";
const folder = `${__dirname}/../`;
const packageName = 'svg'
/**
 * Read a file and return it's parsed JSON.
 * 
 * @param {string} filename 
 * @param {string} overridePackageName 
 * @returns object of the parsed json
 */
const readJSONtoObject = (filename, overridePackageName = undefined) => {
  let filepath = path.resolve(svg_package, filename);

  if (overridePackageName !== undefined) {
    filepath = path.resolve(getSVGPackagePath(overridePackageName), filename);
  }

  const file = fs.readFileSync(filepath, { encoding });
  return JSON.parse(file);
};

const getVersion = (overridePackageName = undefined) => {
  const file = readJSONtoObject("package.json", overridePackageName);
  return JSON.parse(file).version;
};

const getMeta = (withPaths, overridePackageName = undefined) => {
  const meta = readJSONtoObject("meta.json", overridePackageName);
  if (withPaths) {
    const total = meta.length;
    meta.forEach((icon, i) => {
      const svg = fs.readFileSync(`${folder}${pName}/svg/${icon.name}.svg`, { encoding });
      icon.path = svg.match(/ d="([^"]+)"/)[1];
    });
  }
  return meta;
};

exports.getVersionLight = () => {
  return getVersion('light-svg');
}

exports.getMetaLight = (withPaths) => {
  return getMeta(withPaths, 'light-svg');
}

exports.getVersion = getVersion;

exports.getMeta = getMeta;

exports.closePath = (path) => {
  return path.replace(/(\d)M/g, '$1ZM');
};

exports.write = (file, data) => {
  fs.writeFileSync(file, data);
};

exports.read = (file) => {
  return fs.readFileSync(file, 'utf8');
};

exports.exists = (file) => {
  return fs.exists(file);
};
