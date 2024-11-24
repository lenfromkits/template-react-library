const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

const nodeModulesPath = path.resolve(rootDir, 'node_modules');
const reactPath = path.join(nodeModulesPath, 'react');
const reactDomPath = path.join(nodeModulesPath, 'react-dom');
const nodeModulesReactPath = path.resolve(rootDir, 'node_modules_react');
const reactBackupPath = path.join(nodeModulesReactPath, 'react');
const reactDomBackupPath = path.join(nodeModulesReactPath, 'react-dom');

function createSymlink(target, link) {
    if (!fs.existsSync(link)) {
        fs.symlinkSync(target, link, 'junction');
    }
}

function removeSymlink(link) {
    if (fs.existsSync(link)) {
        fs.unlinkSync(link);
    }
}

function copyFolderSync(from, to) {
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const stat = fs.lstatSync(path.join(from, element));
        if (stat.isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else if (stat.isDirectory()) {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

function moveFolderSync(from, to) {
    copyFolderSync(from, to);
    fs.rmdirSync(from, { recursive: true });
}

function installReactPackages() {
    console.log('Installing react and react-dom...');
    execSync('npm install react react-dom', { stdio: 'inherit' });
}

const action = process.argv[2];

if (action === 'show') {
    if (!fs.existsSync(nodeModulesReactPath)) {
        fs.mkdirSync(nodeModulesReactPath);
    }

    if (!fs.existsSync(reactBackupPath) || !fs.existsSync(reactDomBackupPath)) {
        if (!fs.existsSync(reactPath) || !fs.existsSync(reactDomPath)) {
            console.log('React packages are not installed. Installing react and react-dom...');
            installReactPackages();
        }

        try {
            console.log('Moving react and react-dom folders...');
            moveFolderSync(reactPath, reactBackupPath);
            moveFolderSync(reactDomPath, reactDomBackupPath);
        } catch (error) {
            console.error('Failed to move React folders. Please close the IDE and move them manually.');
            process.exit(1);
        }
    }
    if (fs.existsSync(reactPath) || fs.existsSync(reactDomPath)) {
        // Attempt to remove these existing folders
        try {
            console.log('Removing existing react and react-dom folders...');
            fs.rmdirSync(reactPath, { recursive: true });
            fs.rmdirSync(reactDomPath, { recursive: true });
            if (fs.existsSync(reactPath) || fs.existsSync(reactDomPath)) {
                console.error('Failed to remove existing React folders. Please close the IDE and remove them manually.');
                process.exit(1);
            }
        } catch (error) {
            console.error('Failed to remove existing React folders. Please close the IDE and remove them manually.');
            process.exit(1);
        }
    }

    console.log('Creating symlinks...');
    createSymlink(reactBackupPath, reactPath);
    createSymlink(reactDomBackupPath, reactDomPath);

} else if (action === 'hide') {
    console.log('Removing symlinks...');
    removeSymlink(reactPath);
    removeSymlink(reactDomPath);

} else {
    console.error('Invalid action. Use "show" or "hide".');
    process.exit(1);
}