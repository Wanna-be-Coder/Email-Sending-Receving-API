import * as express from 'express';


const middlewareObj:any ={};
 



middlewareObj.isLoggedIn = (req: express.Request,res: express.Response,next: any) => {
	console.log(req.params.id);
    if(req.isAuthenticated()){
		next();
	}
	else{
		res.redirect('/login');
	}

}

middlewareObj.isLoggedInFromEmail = (req: express.Request,res: express.Response,next: any) => {
	console.log(req.params.id);
    if(req.isAuthenticated()){
		next();
	}
	else{
		res.redirect(`/login/${req.params.id}`);
	}

}


// module.exports=middlewareObj;

export default middlewareObj;