import { useState, useEffect } from "react";
import { PokeAPI } from "./api";

// simple card properties including image and types
interface PokemonCard {
  id: number;
  name: string;
  types: string[];
  image: string;
}

// Card uses the same shape as PokemonCard
interface CardProps extends PokemonCard {}


const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400",
  dragon: "bg-purple-700",
  dark: "bg-gray-700",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-400",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-green-700",
  ghost: "bg-indigo-700",
  steel: "bg-gray-500",
};

function Card(props: CardProps) {
  console.log("render card", props.id, props.image);
  return (
    <div className="rounded-lg p-2 bg-white shadow text-center border-2 border-blue-500">
      <div className="flex justify-center items-center mb-1 space-x-2">
        <div className="font-bold">{props.id}</div>
        <div className="border-black-100 bg-gray-200 px-1 rounded capitalize">{props.name}</div>
      </div>
      <img
        className="mx-auto w-60 h-60 object-contain"
        src={props.image}
        alt={props.name}
        // removed lazy loading for initial debugging
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://via.placeholder.com/96?text=No+image";
        }}
      />
      <div className="mx-auto mt-1 inline-block">
        {props.types.map((type) => (
          <span
            key={type}
            className={`mr-1 px-2 py-1 rounded text-white text-xs capitalize ${
              typeColors[type] || "bg-gray-300"
            }`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}


export function Root() {
  const [offset, setOffset] = useState(0);
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);

  useEffect(() => {
    async function load() {
      const list = await PokeAPI.listPokemons(offset, 20);
      const details = await Promise.all(
        list.results.map((r) => PokeAPI.getPokemonByName(r.name))
      );
      const newCards: PokemonCard[] = details.map((p) => ({
        id: p.id,
        name: p.name,
        types: p.types.map((t) => t.type.name),
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
      }));
      setPokemons((prev) => [...prev, ...newCards]);
    }
    load();
  }, [offset]);

  function loadMore() {
    setOffset((o) => o + 20);
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemons.map((p) => (
          <Card
            key={p.id}
            id={p.id}
            name={p.name}
            types={p.types}
            image={p.image}
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={loadMore}
        >
          Carica altri pokémon
        </button>
      </div>
    </div>
  );
}

/*function getTypeColor(type: string): string {
  return typeColors[type];
}*/

/*const typeColors: { [key: string]: string } = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400",
  dragon: "bg-purple-700",
  dark: "bg-gray-700",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-400",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-green-700",
  ghost: "bg-indigo-700",
  steel: "bg-gray-500",
};
*/
/*
interface PokemonCard {
  id: number;
  image: string;
  name: string;
  types: string[];
}

async function fetchData(offset: number): Promise<PokemonCard[]> {
  const list = await PokeAPI.listPokemons(offset, 20);
  const pokemons = await Promise.all(
    list.results.map(async (item: { name: string; url: string }) => {
      const pokemon = await PokeAPI.getPokemonByName(item.name);
      return pokemon;
    }),
  );

  return pokemons.map((item) => ({
    id: item.id,
    image: item.sprites.other?.["official-artwork"].front_default ?? "",
    name: item.name,
    types: item.types.map((type) => type.type.name),
  }));
}*/