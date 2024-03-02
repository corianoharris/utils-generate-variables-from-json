import * as fs from 'fs';

import * as path from 'path';

/**

   * Recursively generates SCSS variables from a JSON object.

   *

   * @param {Record<string, any>} obj - The JSON object to process.

   * @param {string} [prefix=''] - The prefix to prepend to variable names.

   * @returns {string} A string containing SCSS variables.

   */

  const generateSCSSVariables = (obj: Record<string, any>, prefix: string = ''): string => {

    const variables: string[] = [];

 

    for (const [key, value] of Object.entries(obj)) {

      const currentKey = `${prefix}${key}`;

 

      if (typeof value === 'object' && value !== null) {

        variables.push(generateSCSSVariables(value, `${currentKey.replace(/\s+/g, '-')}-`));

      } else if (key === 'value') {

        const cleanValueKey = cleanVariableName(currentKey.replace(/\s+/g, '-').replace('-value', ''));

        variables.push(`$${cleanValueKey}: ${value};`);

      }

    }

 

    return variables.join('\n');

  }

 

  /**

   * Writes SCSS variables to specified files.

   *

   * @param {string} variables - The SCSS variables string.

   * @param {string} filePathToDist - The path for the dist file.

   * @param {string} filePathToSrc - The path for the src file.

   */

  function writeSCSSFile(variables: string, filePathToDist: string): void {

    try {

      fs.writeFileSync(filePathToDist, variables);

      console.log(`SCSS variables have been written to: ${filePathToDist}`);

    } catch (error) {

      console.error('Error writing SCSS files:', error);

      process.exit(1);

    }

  }

 

  /**

   * Sanitizes the SCSS variable name.

   *

   * @param {string} variableName - The variable name to sanitize.

   * @returns {string} The sanitized variable name.

   */

  function cleanVariableName(variableName: string): string {

    return variableName.replace(/global|Colors|value/g, '').replace(/-+/g, '-').replace(/^-/, '').trim();

  }

     /**

   * Main function to process JSON and generate SCSS files.

   */

 

  const main = async (): Promise<void> => {

 

    const inputFilePath = path.join(__dirname, 'design-tokens.json');

 

    try {

      const jsonContent = fs.readFileSync(inputFilePath, 'utf-8');

      const jsObject: Record<string, any> = JSON.parse(jsonContent);

 

      const scssVariables = generateSCSSVariables(jsObject).toLowerCase();

 

    
      const outputPathToDist = path.join(__dirname, 'dist', '_variables.scss');

 

      if (!fs.existsSync(path.join(__dirname, 'dist'))) {

        fs.mkdirSync(path.join(__dirname, 'dist'));

      }

 

      writeSCSSFile(scssVariables, outputPathToDist);

    } catch (error) {

      console.error('Error reading or parsing JSON file:', error);

      process.exit(1);

    }

 

  }

 

  main()
