
const user = require("./cmds_user.js");
const quiz = require("./cmds_quiz.js");
const favs = require("./cmds_favs.js");
const readline = require('readline');

const net = require('net');

const host = 'localhost';
const port = '8080';

let socketClients = [];

let server = net.createServer( (socket) =>{
  socket.write('Welcome (Server Quizzes)\n')
  socketClients.push(socket); 


  let isFinished =(data) =>{
  
    if ( data.indexOf("\n") > 0
    ) {
      return true
    }
    return false
  }
  
  let received = '';
  socket.on('data', (data) => {
        for (let i = 0; i < socketClients.length; ++i) {
      
        if (socketClients[i] === socket){
          
          let textChunk = data.toString('utf8');

          if (isFinished(textChunk)) {

            proccesorCommand(received);
            received = '';
          } else {
            received += data;
          }

        }

    };  
  });
  
  socket.on('end', () => {
      let i = socketClients.indexOf(socket);
      console.log(`Delete gamer ${i}`)
  });

  socket.on('close', () => {
      let i = socketClients.indexOf(socket);
      socketClients.splice(i, 1);
      console.log(`Delete gamer ${i}`)
  });

  socket.on('error', () => {
    let i = socketClients.indexOf(socket);
    console.log(`Error gamer ${i}`)
  });  

  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  //   prompt: "> "
  // });



  const rl = readline.createInterface({
    input: socket,
    output: socket, 
  });

  rl.log = (msg) => { // Add log to rl interface
      socket.write(msg + "\n");
  }
  rl.questionP = (msg) => { // Add log to rl interface
   socket.write(msg);
}

  let proccesorCommand = async (data) => {
    try{
        let cmd = data;
      if      ('' === cmd)   {}
      else if ('h' === cmd)  { console.log('estamos en h'),  user.help(rl);}

      else if (['lu', 'ul', 'u'].includes(cmd)) { await user.list(rl);}
      else if (['cu', 'uc'].includes(cmd))      { await user.create(rl);}
      else if (['ru', 'ur', 'r'].includes(cmd)) { await user.read(rl);}
      else if (['uu'].includes(cmd))            { await user.update(rl);}
      else if (['du', 'ud'].includes(cmd))      { await user.delete(rl);}

      else if (['lq', 'ql', 'q'].includes(cmd)) { await quiz.list(rl);}
      else if (['cq', 'qc'].includes(cmd))      { await quiz.create(rl);}
      else if (['tq', 'qt', 't'].includes(cmd)) { await quiz.test(rl);}
      else if (['uq', 'qu'].includes(cmd))      { await quiz.update(rl);}
      else if (['dq', 'qd'].includes(cmd))      { await quiz.delete(rl);}

      else if (['lf', 'fl', 'f'].includes(cmd)) { await favs.list(rl);}
      else if (['cf', 'fc'].includes(cmd))      { await favs.create(rl);}
      else if (['df', 'fd'].includes(cmd))      { await favs.delete(rl);}

      else if ('e'===cmd)  {
         //rl.log('Bye!');  
         socket.write('Bye!')  
        // process.exit(0);
        socket.end('See you later');
      } else {
          // rl.log('UNSUPPORTED COMMAND!');
          socket.write('Bye!')
          user.help(rl);
      };
      } catch (err) { socket.write(`${err}`) /*rl.log(`  ${err}`);*/}
    finally       { /* rl.prompt();*/ }
  };

})

 server.listen(port);
console.log(`Server MOOC MOD 4 at ${host}:${port}`);