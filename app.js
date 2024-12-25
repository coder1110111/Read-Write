const http=require("http");
const fs=require("fs");
const server=http.createServer((req,res)=>{
    const url=req.url;
    const method=req.method;

    if(req.url==='/'){
        res.setHeader("Content-Type","text/html");
        res.end(
            `
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username"></input>
                <button type="submit">Add</button>
                </form>
                `
        )
    }   else{
            if(req.url=='/message'){
                res.setHeader("Content-Type","text/html");
                let datachunks=[];
                req.on('data',(chunks)=>{
                    console.log(chunks);
                    datachunks.push(chunks);
                })

                req.on('end',()=>{
                    let combinedbuffer=Buffer.concat(datachunks);
                    console.log(combinedbuffer.toString());
                    let value=combinedbuffer.toString().split("=")[1];
                    console.log(value);
                    
                    fs.writeFile('check.txt',value,(err)=>{
                        //if there is no error will go down;

                        res.statusCode=302  //This status code is shown when a page redirects you to another page
                        res.setHeader('location','/')  //This is the redirection page
                        res.end()      //This signifies that there will be no coming data and ends the response

                    })
                })
            }
            else{
                if(req.url=='/read'){
                    fs.readFile('check.txt',(err,data)=>{
                        console.log(data.toString());  //Data is returned as a Buffer hence we convert it to string
                        res.end(                        //Used to finally send a response to the client
                            `<h1>${data.toString()}</h1>`
                        );
                    })
                }
            }
    }
})
server.listen(3000,()=>{
    console.log("Server is Running");
})