//Obtener los id de cada etiqueta que participa en el modal
const modal = document.getElementById("modalPokemon");
const contenedor_modal = document.getElementById("contenidoModal");
const btn_cerra_modal = document.getElementById("btn_cerrar_Modal");

//Capturar los elementos del DOM
const btnCargar = document.getElementById("btnCargar");

//Capturar el contenedor donde estaran la tarjetas
const contenedor = document.getElementById("poke-contenedor");

async function obtenerPokemon() {
  try {
    //Solicitud del API al servidor

    //PASO 1: Primero informar al usario
    contenedor.innerHTML = `<p class="text-center col-span-full font-bold text-red-600 
    animate-pulse text-lg"> 
    Conectando al Servidor...</p>`;

    //PASO 2: Solicitud al servidor
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

    //PASO 3:
    if (!respuesta.ok) {
      throw new Error("El servidor no responde....");
    }

    //PASO 4: traducir la respuesta del servidor que es un texto plano a JSON para que JS la pueda interpretar
    const datos = await respuesta.json();
    const listaPokemon = datos.results;

    //PASO 5: Limpiamos el contenedor
    contenedor.innerHTML = "";

    console.log("Datos recibido correctamente: ", listaPokemon);

    for (let i = 0; i < listaPokemon.length; i++) {
      const pokemon_position = listaPokemon[i];
      const idPokemon = i + 1;

      //Crear la ruta para traer la imagen
      const urlImagen = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${idPokemon}.png`;

      //Crear contenedor de la tarjeta
      const tarjeta = document.createElement("div");
      tarjeta.className =
        "bg-slate-800 border border-slate-700 p-4 text-center";

      //Crear la etiqueta de la imagen
      const imagen = document.createElement("img");
      imagen.src = urlImagen;
      imagen.alt = pokemon_position.name;
      imagen.className = "w-32 h-32 mx-auto drop-shadow-md";

      //Crear el SPAM del numero
      const numero = document.createElement("span");
      numero.className = "text-xs font-bold text-black-500 block mt-2";
      numero.textContent = `#${String(idPokemon).padStart(3, "0")}`;

      //Crea el h2 para el nombre
      const nombre = document.createElement("h2");
      nombre.className = "text-xl font-bold capitalize text-white mt-1";
      nombre.textContent = pokemon_position.name;

      //Agrupar todo dentro del contenedor DIV
      tarjeta.appendChild(imagen);
      tarjeta.appendChild(numero);
      tarjeta.appendChild(nombre);

      contenedor.appendChild(tarjeta);

      //Parte del modal
      tarjeta.addEventListener("click", () => {
        obtenerDetallePokemon(idPokemon);
      });
    }
  } catch (error) {
    //Mostraremos mensaje al usario si falla la red.
  }
}

btnCargar.addEventListener("click", obtenerPokemon);

//Funcion asincrona para ontener los detalles de cada pokemon
async function obtenerDetallePokemon(id) {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    const pokemon = await respuesta.json();

    mostrarModal(pokemon);
  } catch (error) {
    console.log(error);
  }
}

function mostrarModal(pokemon) {
  contenedor_modal.innerHTML = `

        <img
            src="${pokemon.sprites.front_default}"
            class="mx-auto w-40">

        <h2 class="text-3xl font-bold text-center capitalize">
            ${pokemon.name}
        </h2>

        <p><strong>Altura:</strong> ${pokemon.height}</p>

        <p><strong>Peso:</strong> ${pokemon.weight}</p>

        <p><strong>Experiencia Base:</strong> ${pokemon.base_experience}</p>

        <p><strong>Tipo:</strong>
            ${pokemon.types.map((t) => t.type.name).join(", ")}
        </p>`;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

btn_cerra_modal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});
