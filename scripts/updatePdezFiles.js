const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');
const { zip } = require('zip-a-folder');

const from = path.join(__dirname, '..', '..', 'processing-examples');
const to = path.join(__dirname, '..', 'content', 'examples');

/**
  This script updates the Processing code to create the .pdez files for each example
**/
const updatePdezFiles = async (portExamples) => {
  const examplesWithPdez = listExamplesWithPdez(to);
  const examplesToUpdate = diffExamples(portExamples, examplesWithPdez);

  // Loop through and move over all files within the examples
  for (let i = 0; i < examplesToUpdate.length; i++) {
    const example = examplesToUpdate[i];
    const generatedZipFile = path.join(
      to,
      example.dirname,
      `${example.name}.pdez`
    );
    const sourceDir = path.join(from, example.dirname);

    // Create the .pdez
    await zip(sourceDir, generatedZipFile);
  }

  console.log('.pdez files crated for all examples successfully!');
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
      fs.existsSync(`${file}z`)
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

module.exports = {
  updatePdezFiles
};
