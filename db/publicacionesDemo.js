// Fotos reales de ejemplo, enlazadas desde su origen.
// Perros: Dog CEO (https://dog.ceo). Gatos, loro y conejo: Wikimedia Commons, con estos créditos:
//   "A classic seal point Siamese cat", Jwads82, CC BY-SA 4.0
//   "Mixed breed tabby seal-point Siamese cat", Hunter Craig, CC BY-SA 4.0
//   "A black cat with dab of white paint on chest", Michael Palmer, CC BY-SA 4.0
//   "Green Parrot (8560048446)", Michael Gwyther-Jones, CC BY 2.0
//   "Domestic white rabbit sitting in a meadow", Niftypen, CC BY 4.0
//   "White Persian cat beside a Rock and a paper cup", Hindustanilanguage, CC BY 4.0
const PERROS = "https://images.dog.ceo/breeds";
const WIKIMEDIA = "https://upload.wikimedia.org/wikipedia/commons/thumb";

export const publicaciones = [
  { clave: "firulais", autor: "prueba", tipo: "PERDIDA", especie: "PERRO", nombre: "Firulais", raza: "Labrador", color: "dorado", descripcion: "Collar rojo, muy amigable, responde a su nombre.", barrio: "Cala Cala", dias: 2, estado: "ACTIVA",
    fotos: [`${PERROS}/labrador/n02099712_610.jpg`, `${PERROS}/labrador/n02099712_2473.jpg`, `${PERROS}/labrador/n02099712_6426.jpg`] },
  { autor: "ana", tipo: "ENCONTRADA", especie: "GATO", nombre: null, raza: "Siamés", color: "crema", descripcion: "Lo encontré en la plaza, tiene ojos azules y está asustado.", barrio: "Queru Queru", dias: 1, estado: "ACTIVA",
    fotos: [`${WIKIMEDIA}/2/2f/A_classic_seal_point_Siamese_cat.jpg/960px-A_classic_seal_point_Siamese_cat.jpg`, `${WIKIMEDIA}/4/44/Mixed_breed_tabby_seal-point_Siamese_cat.jpg/960px-Mixed_breed_tabby_seal-point_Siamese_cat.jpg`] },
  { autor: "ana", tipo: "PERDIDA", especie: "GATO", nombre: "Michi", raza: "Mestizo", color: "negro", descripcion: "Mancha blanca en el pecho, no tiene collar.", barrio: "Sarco", dias: 4, estado: "ACTIVA",
    fotos: [`${WIKIMEDIA}/d/d4/A_black_cat_with_dab_of_white_paint_on_chest.jpg/960px-A_black_cat_with_dab_of_white_paint_on_chest.jpg`] },
  { autor: "prueba", tipo: "ENCONTRADA", especie: "PERRO", nombre: null, raza: "Mestizo", color: "café", descripcion: "Perro mediano con collar azul sin placa, muy tranquilo.", barrio: "Hipódromo", dias: 3, estado: "ACTIVA",
    fotos: [`${PERROS}/mix/tropik.jpg`, `${PERROS}/mix/toby3.jpg`] },
  { autor: "prueba", tipo: "PERDIDA", especie: "OTRO", nombre: "Pepe", raza: "Loro", color: "verde", descripcion: "Loro que dice hola, se escapó de su jaula.", barrio: "Tupuraya", dias: 5, estado: "ACTIVA",
    fotos: [`${WIKIMEDIA}/8/8a/Green_Parrot_%288560048446%29.jpg/960px-Green_Parrot_%288560048446%29.jpg`] },
  { autor: "ana", tipo: "PERDIDA", especie: "PERRO", nombre: "Luna", raza: "Husky", color: "gris y blanco", descripcion: "Ojos de distinto color, lleva un arnés negro.", barrio: "Las Cuadras", dias: 6, estado: "ACTIVA",
    fotos: [`${PERROS}/husky/n02110185_15063.jpg`, `${PERROS}/husky/n02110185_10844.jpg`, `${PERROS}/husky/n02110185_184.jpg`, `${PERROS}/husky/n02110185_1794.jpg`] },
  { autor: "ana", tipo: "ENCONTRADA", especie: "OTRO", nombre: null, raza: "Conejo", color: "blanco", descripcion: "Conejo encontrado en un jardín, parece ser mascota.", barrio: "Muyurina", dias: 2, estado: "ACTIVA",
    fotos: [`${WIKIMEDIA}/b/b1/Domestic_white_rabbit_sitting_in_a_meadow.jpg/960px-Domestic_white_rabbit_sitting_in_a_meadow.jpg`] },
  { autor: "prueba", tipo: "PERDIDA", especie: "PERRO", nombre: "Rocky", raza: "Pastor alemán", color: "negro y fuego", descripcion: "Tiene una cicatriz en la oreja izquierda.", barrio: "Villa Busch", dias: 10, estado: "VOLVIO_A_CASA",
    fotos: [`${PERROS}/german-shepherd/n02106662_2058.jpg`, `${PERROS}/german-shepherd/n02106662_13599.jpg`] },
  { autor: "ana", tipo: "PERDIDA", especie: "GATO", nombre: "Nieve", raza: "Persa", color: "blanco", descripcion: "Ejemplo de publicación ocultada por moderación.", barrio: "Temporal", dias: 7, estado: "OCULTA",
    fotos: [`${WIKIMEDIA}/0/06/White_Persian_cat_beside_a_Rock_and_a_paper_cup.jpg/960px-White_Persian_cat_beside_a_Rock_and_a_paper_cup.jpg`] },
];
