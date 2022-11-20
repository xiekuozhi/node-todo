const db = require('./db.js');
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    const list = await db.read()
    list.push({ title: title, done: false })
    db.write(list)
}
module.exports.clear = async () => {
    await db.write([])
}
function markAsDone(list,index){
    list[index].done = true
    db.write(list) 
}
function markAsUndone(list,index){
    list[index].done = false
    db.write(list)
}
function updateTitle(list ,index){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入新标题',
        default: list[index].title
    }).then(answers => {
        list[index].title = answers.title
        db.write(list)
    })
}
function remove(list,index){
    list.splice(index, 1)
    db.write(list)
}
function askForAction(list, index) {
    const actions={markAsDone,markAsUndone,updateTitle,remove}
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '已完成', value: 'markAsDone' },
            { name: '未完成', value: 'markAsUndone' },
            { name: '改标题', value: 'updateTitle' },
            { name: '删除', value: 'remove' },
        ]
    }).then((answers2) => {
        console.log(answers2.action)
       const action =actions[answers2.action]
       console.log(action)
       action && action(list,index)
       

    })
}
function createTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入新标题',
    }).then(answers => {
        list.push({
            title: answers.title,
            done: false
        })
        db.write(list)
    })
}
function printTask(list) {
    inquirer.prompt(
        {
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [...list.map((task, index) => {
                return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString() }
            }), { name: '创建任务', value: '-2' }, { name: '退出', value: '-1' }]
        },
    )
        .then((answers) => {
            const index = parseInt(answers.index)
            if (index >= 0) {
                askForAction(list, index)
            } else if (index === -2) {
                createTask(list)
            }
        });

}

module.exports.showAll = async (title) => {
    const list = await db.read()
    printTask(list)

}