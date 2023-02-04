const chalk = require('chalk');
module.exports = async (name) => {
    console.log(chalk.blue(`谢谢你`), chalk.white.bgYellow.bold(`${name}`));
    console.log(chalk.yellow(`欢迎访问我的博客：https://etheral.cc`));
}