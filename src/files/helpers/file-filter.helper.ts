export const fileFilter = (req:Express.Request, file:Express.Multer.File, callback:Function )=> {

    if(!file){
        return callback(null,false)
    }
    
    const fileExtension = file.mimetype.split('/').at(1);
    const validExtensions = ['jpg','jpeg','png','gif']
    
    if(!validExtensions.includes(fileExtension)){
        return callback(null,false)
    }

    callback(null,true)
}