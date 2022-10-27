class Usuario {
    constructor(nombre, apellido) {
      //Atributos
      this.nombre = nombre;
      this.apellido = apellido;
      this.libros = [];
      this.mascotas = [];
    }
    //Metodos
    //Retornar todo el nombre
    getFullName() {
      return this.nombre + "" + this.apellido;
    }
    //Agregar un nuevo animal al array
    addMascota(nombreAnimal) {
      this.mascotas.push(nombreAnimal);
    }
    //Retorna numero animales
    countMascotas() {
      return this.mascotas.length;
    }
    //Agregar dato de un libro al array de libros
    addBook(nombre, autor) {
      //Agregar objeto
      const dataLibro = { nombre: nombre, autor: autor };
      this.libros.push(dataLibro);
    }
    //Retorna un array con nombre de libros
    getBookNames() {
      //Busca los nombres del array de libros
      return this.libros.map((libro) => libro.nombre);
    }
  }
  
  //Crear objeto usuario
  const usuario = new Usuario ("Fiorella", "Yao")
  //Mostrar todo el nombre del usuario
  console.log(usuario.getFullName())
  //Agregar mascotas nuevas al usuario
  usuario.addMascota('Marley')
  usuario.addMascota('Guardian')
  usuario.addMascota('Fiona')
  usuario.addMascota('Doky')
  console.log(usuario.countMascotas())
  //Agregar libros al usuario
  usuario.addBook('Harry Potter','J.K.Rowling')
  usuario.addBook('Cincuenta sombras de Grey','E.L.James')
  console.log(usuario.getBookNames())