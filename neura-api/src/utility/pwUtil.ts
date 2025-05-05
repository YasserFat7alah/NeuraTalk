import bcrypt from "bcrypt";

export const validatePW = (passowrd: string) =>{
    return passowrd.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      );
}

export const encryptPW = async ( password: string ): Promise<string> =>{
   const hashedPW = await bcrypt.hash(password, 10);
    return hashedPW;
}

export const comparePW = async ( password: string , ePW: string | null ): Promise<boolean> =>{
    if(!ePW) { ePW = '' };
    const status = await bcrypt.compare(password, ePW);
    return status;
}