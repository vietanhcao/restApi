
import path from 'path';
import fs from 'fs';


export const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..','..', filePath); //go to root file
	fs.unlink(filePath, (err) => console.log(err));
};