1. `import * as fs from 'fs';`
   - This line imports the entire `fs` module from Node.js, which provides file system-related functionality.

2. `import * as path from 'path';`
   - This line imports the entire `path` module from Node.js, which provides utilities for working with file and directory paths.

3. `/**`
   - Begins a multiline comment block.

4. ` * Recursively generates SCSS variables from a JSON object.`
   - Describes the purpose of the function `generateSCSSVariables()` that follows.

5. ` *`
   - Adds an empty line in the comment block for readability.

6. ` * @param {Record<string, any>} obj - The JSON object to process.`
   - Documents the parameter `obj` of the function `generateSCSSVariables()`, stating that it should be a JSON object.

7. ` * @param {string} [prefix=''] - The prefix to prepend to variable names.`
   - Documents the parameter `prefix` of the function `generateSCSSVariables()`, stating that it is optional and defaults to an empty string.

8. ` * @returns {string} A string containing SCSS variables.`
   - Documents the return type of the function `generateSCSSVariables()`, stating that it returns a string containing SCSS variables.

9. ` */`
   - Ends the multiline comment block.

10. `function generateSCSSVariables(obj: Record<string, any>, prefix: string = ''): string {`
    - Begins the definition of the function `generateSCSSVariables()`, which takes a JSON object (`obj`) and an optional prefix (`prefix`) as parameters and returns a string.

11. `  const variables: string[] = [];`
    - Declares an empty array named `variables` to store SCSS variables.

12. `  for (const [key, value] of Object.entries(obj)) {`
    - Initiates a loop iterating over each key-value pair of the input JSON object `obj`.

13. `    const currentKey = `${prefix}${key}`;`
    - Constructs the current key by concatenating the prefix and the key.

14. `    if (typeof value === 'object' && value !== null) {`
    - Checks if the value associated with the current key is an object and not null.

15. `      variables.push(generateSCSSVariables(value, `${currentKey.replace(/\s+/g, '-')}-`));`
    - Recursively calls the `generateSCSSVariables()` function with the nested object, updating the prefix accordingly.

16. `    } else if (key === 'value') {`
    - Checks if the current key is 'value'.

17. `      const cleanValueKey = cleanVariableName(currentKey.replace(/\s+/g, '-').replace('-value', ''));`
    - Cleans the variable name by removing spaces and '-value' suffix using the `cleanVariableName()` function.

18. `      variables.push(`$${cleanValueKey}: ${value};`);`
    - Adds a SCSS variable declaration to the `variables` array in the format `$variableName: variableValue;`.

19. `    }`
    - Closes the if-else block.

20. `  }`
    - Closes the for loop.

21. `  return variables.join('\n');`
    - Returns the SCSS variables as a single string joined by newline characters.

22. `}`
    - Closes the `generateSCSSVariables()` function.

23. `function writeSCSSFile(variables: string, filePathToDist: string): void {`
    - Begins the definition of the `writeSCSSFile()` function, which takes SCSS variables as a string and a file path to write them to.

24. `  try {`
    - Begins a try block to handle potential errors during file writing.

25. `    fs.writeFileSync(filePathToDist, variables);`
    - Attempts to write the SCSS variables to the specified file path using synchronous file writing.

26. `    console.log(`SCSS variables have been written to: ${filePathToDist}`);`
    - Logs a success message indicating that the SCSS variables have been written to the specified file path.

27. `  } catch (error) {`
    - Catches any errors that occur during the file writing process.

28. `    console.error('Error writing SCSS files:', error);`
    - Logs an error message if an error occurs during file writing.

29. `    process.exit(1);`
    - Exits the process with a non-zero exit code to indicate failure.

30. `  }`
    - Closes the catch block.

31. `}`
    - Closes the `writeSCSSFile()` function.

32. `function cleanVariableName(variableName: string): string {`
    - Begins the definition of the `cleanVariableName()` function, which sanitizes SCSS variable names.

33. `  return variableName.replace(/global|Colors|value/g, '').replace(/-+/g, '-').replace(/^-/, '').trim();`
    - Returns the sanitized variable name by removing specific substrings, collapsing multiple hyphens into one, and trimming leading and trailing hyphens.

34. `}`
    - Closes the `cleanVariableName()` function.

35. `const main = async (): Promise<void> => {`
    - Begins the definition of the `main()` function, which serves as the entry point of the script.

36. `  const inputFilePath = path.join(__dirname, 'design-tokens.json');`
    - Constructs the file path of the input JSON file `design-tokens.json` relative to the current directory.

37. `  try {`
    - Begins a try block to handle potential errors during file reading and parsing.

38. `    const jsonContent = fs.readFileSync(inputFilePath, 'utf-8');`
    - Reads the content of the input JSON file synchronously, assuming it is encoded in UTF-8.

39. `    const jsObject: Record<string, any> = JSON.parse(jsonContent);`
    - Parses the JSON content into a JavaScript object, ensuring it adheres to the specified type `Record<string, any>`.

40. `    const scssVariables = generateSCSSVariables(jsObject).toLowerCase();`
    - Generates SCSS variables from the parsed JSON object using the `generateSCSSVariables()` function and converts them to lowercase.

41. `    const outputPathToDist = path.join(__dirname, 'dist', '_variables.scss');`
    - Constructs the file path of the output SCSS file `dist/_variables.scss` relative to the current directory.

42. `    if (!fs.existsSync(path.join(__dirname, 'dist'))) {`
    - Checks if the `dist` directory exists in the current directory.

43. `      fs.mkdirSync(path.join(__dirname, 'dist'));`
    - Creates the `dist` directory if it does not exist.

44. `    }`
    - Closes the if statement.

45. `    writeSCSSFile(scssVariables, outputPathToDist);`
    - Writes the generated SCSS variables to the specified output file path using the `writeSCSSFile()` function.

46. `  } catch (error) {`
    - Catches any errors that occur during file reading, parsing, or writing.

47. `    console.error('Error reading or parsing JSON file:', error);`
    - Logs an error message if an error occurs during file reading or parsing.

48. `    process.exit(1);`
    - Exits the process with a non-zero exit code to indicate failure.

49. `  }`
    - Closes the catch block.

50. `}`
    - Closes the `main()` function.

51. `main()`
    - Calls the `main()` function to execute the script.



