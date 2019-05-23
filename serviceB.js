const express = require('express')
const ipc=require('node-ipc');

const app = express()
const port = 4000
ipc.config.id   = 'hello';
ipc.config.retry= 1500;
 ipc.connectTo(
        'world',
        function(){
            ipc.of.world.on(
                'connect',
                function(){
                    
                    ipc.log('## connected to world ##'.rainbow);
                    ipc.of.world.emit(
                        'message',  //any event or message type your server listens for
                        {msg:"Hello from client!!!"}
                    )
                }
            );
            ipc.of.world.on(
                'disconnect',
                function(){
                    ipc.log('disconnected from world'.notice);
                }
            );
            ipc.of.world.on(
                'DO_SOMETHING',
                async function(data){
                    try{
                        console.log("Event Caught >>>>>>> Now STarting Processing")
                      	await simulateFailure()
                    }catch(err){
                      console.log("error caught!!",err)
                      ipc.of.world.emit(
	                        'TRANSACTION_FAILED',  //any event or message type your server listens for
	                        data
	                    )
                    }
                }
            );
        }
    );

app.get('/', (req, res) => res.send('Hello from Service B!'))

app.listen(port, () => console.log(`Service B listening on port ${port}!`))
const simulateFailure = ()=>{
	return new Promise ((res,rej)=>{
		setTimeout(()=>{
			console.log("REJECTING >>>>>>>>>>")
			rej()
		},500)
	})
}