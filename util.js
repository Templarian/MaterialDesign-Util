const fs = require('fs');
const path = require('path');

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
 * Read a file and return its content.
 * 
 * @param {string} filename 
 * @param {string} overridePackageName 
 * @returns content of the file
 */
const readFile = (filename, overridePackageName = undefined) => {
  let filepath = path.resolve(svg_package, filename);

  if (overridePackageName !== undefined) {
    filepath = path.resolve(getSVGPackagePath(overridePackageName), filename);
  }

  return fs.readFileSync(filepath, { encoding: "utf8" });
}

/**
 * Read a JSON and return an object of the parsed JSON.
 * 
 * @param {string} filename 
 * @param {string} overridePackageName 
 * @returns object of the parsed json
 */
const readJSONtoObject = (filename, overridePackageName = undefined) => {
  const file = readFile(filename, overridePackageName);
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
      let svgFilename = path.join("svg", `${icon.name}.svg`);
      const svg = readFile(svgFilename, overridePackageName);
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
  return fs.existsSync(file);
};
