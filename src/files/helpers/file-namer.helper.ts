import {v4 as uuid} from 'uuid'


export const fileNamer = (req:Express.Request, file:Express.Multer.File, callback:Function )=> {

    if(!file){
        return callback(null,false)
    }
    
    const fileExtension = file.mimetype.split('/').at(1);
    
    const newFileName = `${uuid()}.${fileExtension}`

    callback(null,newFileName)
}