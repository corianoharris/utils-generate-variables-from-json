import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively generates variables from a JSON-like object in a specific format.
 *
 * @param {T} obj - The JSON-like object to process.
 * @param {string} [prefix=''] - The prefix to prepend to variable names.
 * @returns {string} A string containing formatted variables.
 */
const generateVariables = <T extends object>(obj: T, prefix: string = ''): string => {
    const variables: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
        const currentKey = `${prefix}${key}`;

        if (typeof value === 'object' && value !== null) {
            variables.push(generateVariables(value, `${currentKey.replace(/\s+/g, '-')}-`));
        } else if (key === 'value') {
            const formattedKey = formatVariableName(currentKey.replace(/\s+/g, '-').replace('-value', ''));
            variables.push(`$${formattedKey}: ${value};`);
        }
    }

    return variables.join('\n');
}

/**
 * Writes formatted variables to a specified file.
 *
 * @param {string} content - The formatted variables string.
 * @param {string} filePath - The path to the file where variables will be written.
 */
const writeFile = (content: string, filePath: string): void => {
    try {
        fs.writeFileSync(filePath, content);
        console.log(`Variables have been written to: ${filePath}`);
    } catch (error) {
        console.error('Error writing file:', error);
        process.exit(1);
    }
}

/**
 * Formats the variable name for use in a specific format.
 *
 * @param {string} name - The variable name to format.
 * @returns {string} The formatted variable name.
 */
const formatVariableName = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-/, '').trim();
}

/**
 * Main function to process JSON and generate files with formatted variables.
 *
 * @param {string} [inputDir=''] - The directory containing the input JSON file.
 * @param {string} [outputDir=''] - The directory where the output file will be saved.
 * @param {string} [outputFile='variables.scss'] - The name of the output file.
 */
const main = async (inputDir: string = '', outputDir: string = '', outputFile: string = 'variables.scss'): Promise<void> => {
    const inputFilePath = path.join(__dirname, inputDir);

    try {
        const jsonContent = fs.readFileSync(inputFilePath, 'utf-8');
        const dataObject = JSON.parse(jsonContent);

        const formattedVariables = generateVariables(dataObject);

        const outputFilePath = path.join(__dirname, outputDir, outputFile);

        if (!fs.existsSync(path.join(__dirname, outputDir))) {
            fs.mkdirSync(path.join(__dirname, outputDir), { recursive: true });
        }

        writeFile(formattedVariables, outputFilePath);
    } catch (error) {
        console.error('Error processing JSON file:', error);
        process.exit(1);
    }
}

// Example usage
main('input', 'output', 'styles.scss');

