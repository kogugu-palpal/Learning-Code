const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
readline.question('Enter a number: ', (num) => {
  if (parseInt(num) % 2 === 0) {
    console.log('Even');
  } else {
    console.log('Odd');
  }
  readline.close();
});