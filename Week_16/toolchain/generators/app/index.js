var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    // method1() {
    //     this.log('method 1 just ran');
    // }

    // method2() {
    //     this.log('method 2 just ran');
    // }
    

    initPackage() {
        const pkgJson = {
            devDependencies: {
                eslint: '^3.15.0'
            },
            dependencies: {
                react: '^16.2.0'
            }
        }
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        // this.npmInstall(['lodash'], { 'save-dev': true });
        this.npmInstall()
    }

    async writing() {
        this.fs.copyTpl(
            this.templatePath('t.html'),
            this.destinationPath('public/index.html'),
            { title: 'Templating with Yeoman' }
        );
    }
};