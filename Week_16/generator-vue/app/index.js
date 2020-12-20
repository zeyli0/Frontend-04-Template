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
    

    async initPackage() {
        let answer = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.name
            }
        ])
        const pkgJson = {
            "name": answer.name,
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
              "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "ISC",
            "devDependencies": {
                
            },
            "dependencies": {
                
            }
        }
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        // this.npmInstall(['lodash'], { 'save-dev': true });
        this.npmInstall(["vue"], { 'save-dev': false })
        this.npmInstall(["webpack", "vue-loader"], { 'save-dev': true })
    }

    copyFiles() {
        this.fs.copyTpl(
            this.templatePath("HelloWorld.vue"),
            this.destinationPath("src/HelloWorld.vue"),
        
        )
        this.fs.copyTpl(
            this.templatePath("webpack.config.js"),
            this.destinationPath("webpack.config.js"),
            
        )
        this.fs.copyTpl(
            this.templatePath("main.js"),
            this.destinationPath("main.js"),
            
        )
    }
};