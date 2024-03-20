#!/usr/bin/env node

const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const fs = require('fs-extra');

const run = async () => {
    console.log(`iclasser-cli v1.0.0`);
    console.log('Welcome to the iclasser-cli!');
    console.log('This tool will help you get started with your iclasser app.');
    console.log('To get started, you will need your app id from your iclasser.com apps dashboard (if you cant find app id go to https://iclasser.com/teach/app).\n');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'appName',
            message: 'What is your app name?',
        },
        {
            type: 'input',
            name: 'appId',
            message: 'What is your app Id?',

        },
    ]);

    const git = simpleGit();
    const repoUrl = 'https://github.com/iClasser/examples.git'; // Replace with your repo URL
    const cloneDir = `./${answers.appName}`;

    console.log(`Cloning the repository into ${cloneDir}...`);
    await git.clone(repoUrl, cloneDir);

    console.log('Updating package.json...');
    const packagePath = `${cloneDir}/package.json`;
    const packageJson = await fs.readJson(packagePath);
    packageJson.name = answers.appName;
    await fs.writeJson(packagePath, packageJson, { spaces: 2 });

    console.log('Done!');
};

run().catch(console.error);
