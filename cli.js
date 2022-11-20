#!/usr/bin/env node
const program = require('commander');
const api=require('./index.js')


program
  .option('-d, --debug', 'output extra debugging')


  program
  .command('add')
  .description('take a tasks')
  .action((...args) => {
    const words =args.slice(0,-1).join(' ')
    api.add(words).then(()=>{console.log('添加成功')},()=>{console.log('添加失败')})
  });
  
  program
  .command('clear')
  .description('clear all tasks')
  .action((...args) => {
  console.log('clear').then(()=>{console.log('清除完毕')},()=>{console.log('清除失败')})
  });


program.parse(process.argv);

if(process.argv.length===2){
  api.showAll()
}