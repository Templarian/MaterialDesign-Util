const fs = require('fs');
const path = require('path');

const encoding = "utf8";

/**
 * Retrieve the absolute path to the `@mdi/svg` package.
 * 
 * If using from the root of a project, it will return the `node_modules/@mdi/svg` path.
 * Otherwise, it will fallback to 0.3.2 behavior (without validating that it exists).
 * 
 * This help for pnpm in isolated mode where the 0.3.2 behavior try to find the `@mdi/svg` package
 * somewhere in the `.pnpm` store.
 * 
 * @param {string} overridePackageName 
 * @returns the absolute path to the `@mdi/svg` package.
 */
 const getSVGPackagePath = (overridePackageName = undefined) => {
  const pkgName = overridePackageName || "svg";
  const mdi_svg_path = path.resolve(
    process.cwd(),
    "node_modules",
    "@mdi",
    pkgName
  );

  if (fs.existsSync(mdi_svg_path)) {
    return path.resolve(mdi_svg_path);
  } else {
    // Did not find the folder of the package.
    // Fallback to the 0.3.2 behavior.
    return path.resolve(parent_folder, pkgName);
  }
};

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

const parent_folder = path.resolve(`${__dirname}/../`);
const svg_package = getSVGPackagePath();

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
