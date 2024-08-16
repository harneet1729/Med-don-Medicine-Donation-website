
const { urlencoded } = require("express");
var express=require("express");
var fileuploader = require("express-fileupload");
var mysql=require("mysql");
var path=require("path");

const { report } = require("process");

var app=express();

//         port   behavior
app.listen(2004,function(){
    console.log("Server Started");
})

//used to serve .js and .css files from public folder
app.use(express.static("public"));


//db creation n connection
var dbConfiguration={
    host:"localhost",//fixed
    user:"root",//pwd
    password:"", //""
    database:"project" //ur own database name 
}

var refDB=mysql.createConnection(dbConfiguration);
refDB.connect(function(errKuch)
{
    if(errKuch)
        console.log(errKuch);
    else
        console.log("Connected to Server....");
})


app.use(express.urlencoded('extended:true'));//converts binary to object
app.use(fileuploader());

//send home (index) page

app.get("/",function(req,resp)
{
    //resp.send("Its Home Page");

    var puraPath=process.cwd()+"/public/index.html";

    //global object : process
    resp.sendFile(puraPath);
});

//------- Ajax to check email availability

app.get("/chkEmailKuch",function(req,resp)
{
    //0/1 records
       refDB.query("select * from users where email=?",[req.query.email1],function(err,resultAryOfObjects)
       {
            if(err)
                resp.send(err);
                else
                if(resultAryOfObjects.length==0)
                {
                    resp.send("Avilable...");
                }
                else
                resp.send("Already Occupied...");;
       })
})

//send data to database.. 

app.get("/senddata",function(req,resp)
{
    console.log(req.query.email1);
    console.log(req.query.pwd1);
    console.log(req.query.utype); 

    var dataAry=[req.query.email1,req.query.pwd1,req.query.utype];
    console.log(dataAry)

    refDB.query("insert into users value(?,?,?,1)",dataAry,function(err,result){
        if(err)
            resp.send(err);
        else
            resp.send("Inserted Successfully");
    });
});

//check user type

app.get("/checklogin",function(req,resp)
{
    console.log(req.query.email2);
    console.log(req.query.pwd2);
   // resp.send("alpha")
   var dataAry=[req.query.email2,req.query.pwd2];

   refDB.query("select utype from users where email = ? and pwd = ?",dataAry,function(err,result){
   resp.send(result);
   });

   
});

app.get("/updatepwd",function(req,resp)
{
    console.log(req.query.semail);
    console.log(req.query.pwd1);
    console.log(req.query.pwd2);
   
    var dataAry=[req.query.semail,req.query.pwd1];
    var ary2=[req.query.pwd2,req.query.semail];

    // resp.send("har");

   refDB.query("select * from users where email = ? and pwd = ?",dataAry,function(err,result){

    if(err){
        resp.send(err);
    }
    else{
        if(result.length==1){
            refDB.query("update users set pwd = ? where email = ?",ary2,function(err,result){

                if(err){
                    resp.send(err);
                }
                else{
                    resp.send("Password Updated!")
                }

            });
        }
        else {
        resp.send("invalid email/password")
        }

    }

   // resp.send(result);
   });

   
});

//donor profile insert

app.post("/profile-process",function(req,resp)
{
    var dt=new Date();
    console.log(dt.toDateString());

    // console.log(req.files.idproof.name);
    // console.log(req.files.profilepic.name);

     var idname=req.body.email+"-"+req.files.idproof.name;
     var desid=process.cwd()+"/public/idpic/"+idname;
     req.files.idproof.mv(desid,function(err){
            if(err)
                console.log(err);
            else
                console.log("id Uploaded!");
    })

    var pname=req.body.email+"-"+req.files.profilepic.name;
    var desp=process.cwd()+"/public/profilepic/"+pname;
    req.files.profilepic.mv(desp,function(err){
           if(err)
               console.log(err);
           else
               console.log("profile pic Uploaded!");
   })
    // console.log("------------------------------------");
    //resp.send(req.body);
    var a=req.body.email;
    var b=req.body.name;
    var c=req.body.mobile;
    var d=req.body.address;
    var e=req.body.city;
    var f=req.body.idtype;
    var g=req.body.time;

    var dataIns = [a,b,c,d,e,f,g,idname,pname];
    console.log(dataIns)
    

                // form wale name and order should be same as table's colms
//    var dataAry=[req.body.txtEmail,req.body.txtAddr,req.body.state,techs,req.body.branch,fname];
   refDB.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)",dataIns,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully");
   })
})


//donor profile-update


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=====-=-=-==-=
app.post("/profile-update",function(req,resp)
{
//console.log(req.files.profilePic.name);
    var idname,pname;
    // console.log(req.files.idproof);


  if(req.files.idproof!=null)
  {
    idname=req.body.email+"-"+req.files.idproof.name;
      var desp=process.cwd()+"/public/idpic/"+idname;
      req.files.idproof.mv(desp,function(err){
             if(err)
                 console.log(err);
             else
             console.log("id Updated!");
  })
}
else
{
    idname=req.body.hdn2;
  console.log(idname);
}
    if(req.files.profilepic!=null)
    {
        pname=req.body.email+"-"+req.files.profilepic.name;
        var desp=process.cwd()+"/public/profilepic/"+pname;
        req.files.profilepic.mv(desp,function(err){
               if(err)
                   console.log(err);
               else
                   console.log("profile pic Updated!");
    })
  }
  else
  {
    pname=req.body.hdn2;
    console.log(pname);
  }

    console.log("------------------------------------");

    var a=req.body.email;
    var b=req.body.name;
    var c=req.body.mobile;
    var d=req.body.address;
    var e=req.body.city;
    var f=req.body.idtype;
    var g=req.body.time;

    var dataUp = [b,c,d,e,f,g,idname,pname,a];
    console.log(dataUp)
    //resp.send(req.body);
   
//                 // form wale name and order should be same as table's colms
//    var dataAry=[req.body.txtAddr,req.body.state,techs,req.body.branch,fname,req.body.txtEmail];
   refDB.query("update dprofile set name=?, mobile=?, address=? , city=?, prooftype=?, timings=?, proofpic=?, profilepic=? where emailid=?",dataUp,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Updated Successfully!");
   })
})

//donor search btn fn

app.get("/getProfileObject",function(req,resp)
{
    //0/1 records
       refDB.query("select * from dprofile where emailid=?",[req.query.email],function(err,resultAryOfObjects)
       {
            if(err)
                resp.send(err);
               
            else
                resp.send(resultAryOfObjects);;
       })
})


//needy profile page
//needy search btn

//donor search btn fn

app.get("/getNProfileObject",function(req,resp)
{
    //0/1 records
       refDB.query("select * from nprofile where emailid=?",[req.query.email],function(err,resultAryOfObjects)
       {
            if(err)
                resp.send(err);
               
            else
                resp.send(resultAryOfObjects);;
       })
})

//needy insert

app.post("/Nprofile-process",function(req,resp)
{
    var dt=new Date();
    console.log(dt.toDateString());

    // console.log(req.files.idproof.name);
    // console.log(req.files.profilepic.name);

     var idname=req.body.email+"-"+req.files.idproof.name;
     var desid=process.cwd()+"/public/nidpic/"+idname;
     req.files.idproof.mv(desid,function(err){
            if(err)
                console.log(err);
            else
                console.log("id Uploaded!");
    })

    var pname=req.body.email+"-"+req.files.profilepic.name;
    var desp=process.cwd()+"/public/nprofilepic/"+pname;
    req.files.profilepic.mv(desp,function(err){
           if(err)
               console.log(err);
           else
               console.log("profile pic Uploaded!");
   })
    // console.log("------------------------------------");
    //resp.send(req.body);
    var a=req.body.email;
    var b=req.body.name;
    var c=req.body.mobile;
    var d=req.body.address;
    var e=req.body.city;
    var f=req.body.idtype;
    //var g=req.body.time;

    var dataIns = [a,b,c,d,e,f,idname,pname];
    console.log(dataIns)
    

                // form wale name and order should be same as table's colms
//    var dataAry=[req.body.txtEmail,req.body.txtAddr,req.body.state,techs,req.body.branch,fname];
   refDB.query("insert into nprofile values(?,?,?,?,?,?,?,?)",dataIns,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully");
   })
})

//profile update - needy 

app.post("/Nprofile-update",function(req,resp)
{
//console.log(req.files.profilePic.name);
    var idname,pname;
    resp.send(req.files)
    if(req.files.idproof!=null)
    {
        idname=req.body.email+"-"+req.files.idproof.name;
        var desid=process.cwd()+"/public/nidpic/"+idname;
        req.files.idproof.mv(desid,function(err){
               if(err)
                   console.log(err);
               else
                   console.log("id Updated!");
    })
  }
  else{
    idname=req.body.hdn1;
  }
 // console.log("a"+idname);

    if(req.files.profilepic!=null)
    {
        pname=req.body.email+"-"+req.files.profilepic.name;
        var desp=process.cwd()+"/public/nprofilepic/"+pname;
        req.files.profilepic.mv(desp,function(err){
               if(err)
                   console.log(err);
               else
                   console.log("profile pic Updated!");
    })
  }
  else
  {
    pname=req.body.hdn2;
  }

    console.log("------------------------------------");

   
    var a=req.body.email;
    var b=req.body.name;
    var c=req.body.mobile;
    var d=req.body.address;
    var e=req.body.city;
    var f=req.body.idtype;
    //var g=req.body.time;

    var dataUp = [b,c,d,e,f,idname,pname,a];
    console.log(dataUp)
    //resp.send(req.body);
   
//                 // form wale name and order should be same as table's colms
//    var dataAry=[req.body.txtAddr,req.body.state,techs,req.body.branch,fname,req.body.txtEmail];
   refDB.query("update nprofile set name=?, mobile=?, address=? , city=?, prooftype=?, proofpic=?, profilepic=? where emailid=?",dataUp,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Updated Successfully!");
   })
})





//medicine insert - list med

app.post("/list-med",function(req,resp)
{
    var dt=new Date();
    console.log(dt.toDateString());

    // console.log(req.files.idproof.name);
    // console.log(req.files.profilepic.name);

     var pname=req.body.email+"-"+req.files.pic.name;
     var des=process.cwd()+"/public/medpic/"+pname;
     req.files.pic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Med pic Uploaded!");
    })

    // console.log("------------------------------------");
    //resp.send(req.body);
    var a=req.body.email;
    var b=req.body.medicine;
    var c=req.body.packing;
    var d=req.body.expdate;
    var e=req.body.company;
    var f=req.body.description;
    var g=req.body.qty;

    var dataIns = [a,b,c,g,d,e,pname,f];
    console.log(dataIns)
    

                // form wale name and order should be same as table's colms
//    var dataAry=[req.body.txtEmail,req.body.txtAddr,req.body.state,techs,req.body.branch,fname];
   refDB.query("insert into medicines values(?,?,?,?,?,?,?,?,current_date())",dataIns,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("<h1>Medicine Inserted Successfully<h1>");
   })
})


//angular


app.get("/fetchAllRecords",function(req,resp)
{
    refDB.query("select * from users",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})


app.get("/profile-block-angualr",function(req,res)
{                                //table col name
    
    refDB.query("update users set status = 0 where email=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("User Blocked!");
    })
})


app.get("/profile-unblock-angualr",function(req,res)
{                                //table col name
    
    refDB.query("update users set status = 1 where email=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("User Unblocked!");
    })
})


//donors
app.get("/fetchdonors",function(req,resp)
{
    refDB.query("select * from dprofile",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})

//del donor
app.get("/dprofile-del-angualr",function(req,res)
{                                //table col name
    
    refDB.query("delete from dprofile where emailid=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("User Deleted!");
    })
})

//needy
app.get("/fetchneedy",function(req,resp)
{
    refDB.query("select * from nprofile",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})

//del needy
app.get("/nprofile-del-angualr",function(req,res)
{                                //table col name
    
    refDB.query("delete from nprofile where emailid=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("User Deleted!");
    })
})


// fetch city in search meds

app.get("/fetchcity",function(req,resp)
{                                //table col name
    
    refDB.query("select city from dprofile",function(err,jsoncityary){
        if(err)
        resp.send(err);
       
    else
        resp.send(jsoncityary);
    })
})

// fetch meds acc to city - inner join query

app.get("/fetchmed",function(req,res){
    refDB.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.city],function(err,resultmed){
        console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    })
})


//fecth med cards to seek donors..

//fetchmedcard

app.get("/fetchmedcard",function(req,res){
    refDB.query("select * from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=? and medicines.medicine=?",[req.query.city,req.query.med],function(err,resultmedcard){
        console.log(resultmedcard);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmedcard);
            res.send(resultmedcard);
        }
    })
})

// show donor details to needy

app.get("/showdetails",function(req,res){
    refDB.query("select * from dprofile where emailid=?",[req.query.emailid],function(err,resultdonor){
        console.log(resultdonor);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultdonor);
            res.send(resultdonor);
        }
    })
})

//fetch meds
app.get("/fetchmeds",function(req,resp)
{
    refDB.query("select * from medicines where emailid=?",[req.query.email],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})


//unlist med donor

app.get("/med-del-angualr",function(req,res)
{                                //table col name
    
    refDB.query("delete from medicines where emailid=? and medicine=?",[req.query.emailidX,req.query.medicine],function(err,result){
            if(err)
                res.send(err);
            else if(result.affectedRows==0)
            res.send("Invalid");
            else
                res.send("Medicine Deleted!");
    })
})




    