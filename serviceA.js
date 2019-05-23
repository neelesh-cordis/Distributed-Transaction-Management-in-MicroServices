const express = require('express')
var mongoose = require('mongoose');
ipc=require('node-ipc');
ipc.config.id   = 'world';
ipc.config.retry= 1500;
const app = express()
const port = 3000
ipcSocket = null
const data = {
	"userID" : "qweqweqweqweqeqqweqe"
}
mongoose.connect('mongodb://localhost:27017/demo');
var db = mongoose.connection

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: String,
    phone: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});
var User = mongoose.model('user',userSchema)
ipc.serve(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                ipcSocket = socket
                ipc.log('got a message : '.debug, data);
            }
        );
        ipc.server.on(
            'TRANSACTION_FAILED',
            async function(data,socket){
                ipc.log('TRANSACTION_FAILED >>>>>>>>>>>> : '.debug, data);
                var msg = ""
                await rollback(data) ? msg+="Successfull rollback Accomplished" : msg+="rollback Failed !!!"
                console.log("LOG: ",msg) 
            }
        );
    }
);
ipc.server.start();
app.get('/', (req, res) => res.send('Hello from Service A!'))
app.get('/doit',(req,res)=>{
	try{

        let user = new User()
        user.name="ABC"
        user.gender = "M"
        user.email = "abc@xyz.com"
        user.phone = "9999999999"
        user.save((err,response)=>{
            console.log("error in User create >>>>>",err)
            console.log("response in User create >>>>>",response)
            if(err){

            }else{
                ipc.server.emit(
                    ipcSocket,
                    'DO_SOMETHING',  //any event or message type your server listens for
                    user
                )    
                res.status(200).json(response)
            }
        })
	}catch(e){
        res.status(500).json(e)
	}
})




app.listen(port, () => console.log(`Service A listening on port ${port}!`))

const rollback = (data)=>{
    return new Promise((resolve,reject)=>{
        console.log("data._id >>>>>>>>>>",data._id)
        User.deleteOne({_id:data._id},(err)=>{
            if(err){
                console.log("error while rollback.. ") 
                //Ideal scenario would be to Handle failure here using DLQ
                resolve(false)
            }
            else{
                resolve(true)    
            }
        })
    })
}