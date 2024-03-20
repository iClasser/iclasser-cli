#!/usr/bin/env node

import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert file URL to path for __dirname compatibility in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get the current version of the app
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = await fs.readJson(packageJsonPath);
const appVersion = packageJson.version;

const constants = {
    TEACH_URL: 'https://www.iclasser.com/teach/apps',
    REPO_URL: 'https://github.com/iClasser/examples.git'
};

// Function to handle the "create" command
const handleCreate = async () => {
    console.log('Welcome to the iclasser-cli!');
    console.log(`v${appVersion}`, '\n');
    console.log('This tool will help you get started with your iclasser app.');
    console.log(`You will need your app id from your iclasser.com apps dashboard.`);
    console.log(`You can find it here: ${chalk.green(constants.TEACH_URL)}\n`);

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'appName',
            message: 'What is your mobile app name?',
        },
        {
            type: 'input',
            name: 'appId',
            message: 'What is your app Id?',
        },
        {
            type: 'input',
            name: 'appPrivacyPolicyLink',
            message: 'What is your app privacy policy link?',
        },
        {
            type: 'input',
            name: 'appTermsOfServiceLink',
            message: 'What is your app terms of service link?',
        },
        {
            type: 'input',
            name: 'appContactEmail',
            message: 'What is your app contact email?',
        },
    ]);

    if (!answers.appName) {
        console.error('App name is required.');
        return;
    }

    if (!answers.appId) {
        console.error('App Id is required.');
        return;
    }

    const appNameDashed = answers.appName.toLowerCase().replace(/ /g, '-');

    const git = simpleGit();
    const repoUrl = constants.REPO_URL; // Use your repo URL
    const cloneDir = `./${appNameDashed}`;

    console.log(`Cloning the repository into ${cloneDir}...`);
    await git.clone(repoUrl, cloneDir);

    console.log('Updating package.json...');
    const packagePath = `${cloneDir}/package.json`;
    const projectPackageJson = await fs.readJson(packagePath);
    projectPackageJson.name = appNameDashed;
    await fs.writeJson(packagePath, projectPackageJson, { spaces: 2 });

    console.log('Your app is ready, you should:');
    console.log(`1. cd ${appNameDashed}`);
    console.log(`2. npm install`);
    console.log(`3. npm start`);

    console.log('\nDone!');
};

// Function to display the version
const showVersion = () => {
    console.log(`iclasser-cli version: ${appVersion}`);
};

// Main function to parse command-line arguments and invoke appropriate functions
const main = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('No command provided. Use "create" to create a new project or "-v" to see the version.');
        return;
    }

    switch (args[0]) {
        case 'create':
            handleCreate().catch(console.error);
            break;
        case 'version':
        case '-v':
        case '-vv':
            showVersion();
            break;
        default:
            console.log(`Unknown command: ${args[0]}. Use "create" to create a new project or "-v" to see the version.`);
    }
};

main();
