export default class User{
  constructor( id,username, password, name,email, role, token,){
    this.id=id;
    this.username=username;
    this.password=password;
    this.name=name;
    this.email=email;
    this.role=role;
    this.token=token;
  }
}