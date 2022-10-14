import {AppUser} from "./AppUser";

export interface Log{
  id?:number,
  date:Date,
  index_number:string,
  last_name:string,
  first_name:string,
  t1234?:number,
  sov?:number,
  p1?:number,
  p2?:number,
  exam?:number,
  user?:AppUser,
  userStr?:string


}
