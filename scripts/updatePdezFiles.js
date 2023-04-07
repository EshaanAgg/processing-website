const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');
const archiver = require('archiver');

const from = path.join(__dirname, '..', '..', 'processing-examples');
const to = path.join(__dirname, '..', 'content', 'examples');

/**
  This script updates the Processing code to create the .pdez files for each example
**/
const updatePdezFiles = async () => {
  if (!examplesRepoExists()) {
    console.error(
      'To run this script, you must have the processing-examples repo next to the processing-website repo on your computer.'
    );
    return;
  }

  const allExamples = listExamples(from);
  const examplesWithPdez = listExamplesWithPdez(to);

  const examplesToUpdate = diffExamples(allExamples, examplesWithPdez);

  // Loop through and move over all files within the examples
  await examplesToUpdate.forEach(async (example) => {
    const generatedZipFile = path.join(
      to,
      example.dirname,
      example.name,
      '.zip'
    );
    const sourceDir = path.join(from, example.dirname);

    // Create the zip
    await zipDirectory(sourceDir, generatedZipFile);
    // Rename the .zip to .pdez
    path.format({
      ...path.parse(generatedZipFile),
      base: '',
      ext: '.pdez'
    });
  });

  console.log('.pdez files crated for all examples successfully!');
};

/**
  Finds all main example files that are of format CATEGORY/SUBCATEGORY/EXAMPLE/EXAMPLE.pde
**/
const listExamples = (folder) => {
  const files = glob.sync('**/*.pde', { cwd: folder });
  const examples = [];
  files.forEach((file) => {
    const split = file.split(path.sep);
    const basename = path.basename(file, '.pde');

    // If the file is in the right nested folder structure
    // and the file is named the same as the parent.
    if (split.length === 4 && split[2] === basename) {
      examples.push({
        category: split[0],
        subcategory: split[1],
        path: file,
        name: basename,
        dirname: path.dirname(file)
      });
    }
  });
  return examples;
};

/**
  Finds all the examples that already have a created .pdez file
**/
const listExamplesWithPdez = (folder) => {
  const files = glob.sync('**/*.pde', { cwd: folder });
  const examples = [];
  files.forEach((file) => {
    const split = file.split(path.sep);
    const basename = path.basename(file, '.pde');
    const dirname = path.dirname(file);

    // If the file is in the right nested folder structure
    // and the file is named the same as the parent
    // and does not have a associated .pdez file
    if (
      split.length === 4 &&
      split[2] === basename &&
      !fs.existsSync(`${file}z`)
    ) {
      examples.push({
        category: split[0],
        subcategory: split[1],
        path: file,
        name: basename,
        dirname
      });
    }
  });
  return examples;
};

/**
  Finds all the examples from examples1 missing from examples2
**/
const diffExamples = (examples1, examples2) => {
  const missing = [];
  loop1: for (let i = 0; i < examples1.length; i++) {
    for (let j = 0; j < examples2.length; j++) {
      if (examples1[i].path === examples2[j].path) {
        continue loop1;
      }
    }
    missing.push(examples1[i]);
  }
  return missing;
};

/**
  Checks whether the processing-contributions repo is next to this repo
**/
const examplesRepoExists = (_keywords) => fs.existsSync(from);

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 *
 * Used to zip all the contents of the sourceDir to a .zip file specified by outPath
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

module.export = updatePdezFiles;
