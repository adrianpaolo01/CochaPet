import holaMundo from "./holaMundo.js";

describe("Hola mundo", () => {
  it("deberia devolver el saludo Hola Mundo", () => {
    expect(holaMundo()).toEqual("Hola Mundo");
  });
});
