var inquirer = require('inquirer');
const axios = require('axios');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const isDirExist = require('../utils/isDirExist.js');
const createTemplates = [{
    name: 'Vue3-Vite4-TypeScript4-ESLint',
    description: 'Vue3-Vite4-TypeScript4-ESLint',
},,{
    name: 'Next.js+TypeScript+ESLint+Prettier',
    description: 'Next.js+TypeScript+ESLint+Prettier',
},{
    name: 'React(暂无此选项)',
    description: 'React(暂无此选项)',
}, {
    name: 'Angular(暂无此选项)',
    description: 'Angular(暂无此选项)',
}]
const create = async (ProjectName) => {
    let isDirExistRes = await isDirExist(ProjectName)
    if (isDirExistRes) {
        console.log(chalk.redBright(`\n项目文件夹 ${ProjectName} 已存在，请更换项目名称\n`));
    } else {
        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    name: 'projectType',
                    message: chalk.yellowBright('请选择项目类型'),
                    choices: createTemplates.map(item => item.name)
                }
            ])
            .then((answers) => {
                chooseTemplate(answers.projectType, ProjectName);
            })
            .catch((error) => {
                if (error.isTtyError) {
                    console.log("Prompt couldn't be rendered in the current environment")
                } else {
                    console.log("Something else when wrong")
                }
            });
    }
}

function chooseTemplate(answerName, ProjectName) {
    switch (answerName) {
        case 'Vue3-Vite4-TypeScript4-ESLint':
            cloneTemplate('Vue3-Vite4-TypeScript4-ESLint', answerName, ProjectName);
            break;
        case 'React(暂无此选项)':
            noTemplate(answerName);
            break;
        case 'Angular(暂无此选项)':
            noTemplate(answerName);
            break;
        case 'Next.js+TypeScript+ESLint+Prettier':
            noTemplate(answerName);
            break;
    }
}

function cloneTemplate(templateName,ProjectName) {
    axios.get('https://api.github.com/users/etheral12138/repos').then(res => {
        res.data.forEach(item => {
            if (item.name == templateName) {
                const spinner = ora(`Downloadinging ${templateName}`).start();
                download("direct:" + item.clone_url, ProjectName, { clone: true }, (err) => {
                    spinner.stop();
                    fs.access(path.resolve(process.cwd(), ProjectName), fs.constants.F_OK, (err) => {
                        if (err) {
                            cloneTemplateFailed(ProjectName);
                        } else {
                            fs.readdir(path.resolve(process.cwd(), ProjectName), {
                                encoding: 'utf-8'
                            }, (err, files) => {
                                if (files.length == 0) {
                                    cloneTemplateFailed(ProjectName);
                                } else {
                                    console.log(chalk.greenBright(`\n项目创建成功✨✨\n`));
                                    console.log(chalk.greenBright(`\n1. cd ${ProjectName}\n`));
                                    console.log(chalk.greenBright(`\n2. npm install \n`));
                                    console.log(chalk.greenBright(`\n3. 执行项目启动命令\n`));
                                }
                            })
                        }
                    });
                })
            }
        });
    })
}
function cloneTemplateFailed(ProjectName) {
    console.log(chalk.redBright(`\n项目创建失败，请检查网络设置并重试\n`));

    inquirer.prompt({
        type: 'confirm',
        message: '是否重试？',
        name: 'isRetry',
        default: true
    })
        .then((answers) => {
            if (answers.isRetry) {
                if (isDirExist(ProjectName)) {
                    fs.rmdir(path.resolve(process.cwd(), ProjectName), (err) => {
                        create(ProjectName);
                    })
                }
            } else {
                console.log(`\n你可以检查网络设置后手动重试\n`);
            }
        })
}
function noTemplate(answerName) {
    console.log(`\n暂无 ${chalk.redBright(answerName)} ，请选择其他选项\n`);
}

module.exports = create