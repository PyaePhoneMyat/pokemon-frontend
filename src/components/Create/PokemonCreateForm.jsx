import { useState } from "react"
import { POKEMON_TYPES } from "../../../constants"
import useAPI from "../../hooks/useAPI"

const SANITIZED_POKEMON_TYPES = POKEMON_TYPES.filter((type) => type !== "ANY") // m lo tr twy phel

const ENV = import.meta.env
const API_URL =
  ENV.MODE === "development" ? ENV.VITE_DEV_API_URL : ENV.VITE_PROD_API_URL

const PokemonEditForm = () => {
  const initialValues = {
    name: "",
    type: "fire",
    imageUrl: "",
  }
  const [formData, setFormData] = useState(initialValues)

  const { action: createAction, error } = useAPI({
    method: "post",
    url: `${API_URL}/pokemons/`,
  })

  const createPokemon = async (formData) => {
    try {
      if (error) {
        throw error
      }
      if (!formData.name || !formData.type) {
        throw new Error("Name and type are required")
      }

      const res = await createAction({ data: formData })

      if (res.status === 200) {
        alert("Success")
      }
    } catch (err) {
      console.log("Error")
      console.error(err)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const submitForm = (e) => {
    e.preventDefault()

    createPokemon(formData)
  }

  const resetForm = () => {
    setFormData(initialValues)
  }

  return !formData ? (
    <></>
  ) : (
    <form
      onSubmit={submitForm}
      onReset={resetForm}
      className="inline-block my-4 text-left"
    >
      <div>
        <label
          htmlFor="pokemonName"
          className="w-[110px] inline-block font-bold"
        >
          Name:
        </label>
        <input
          type="text"
          placeholder="Pikachu"
          name="pokemonName"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border border-pink-300 rounded-lg bg-pink-200 text-black px-3 py-2 my-4 mx-3 placeholder:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="pokemonType"
          className="w-[110px] inline-block font-bold"
        >
          Type:
        </label>
        <select
          value={formData.type}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, type: event.target.value }))
          }
          className="bg-pink-300 rounded-full px-4 py-2 mx-3"
        >
          {SANITIZED_POKEMON_TYPES.map((type, i) => (
            <option key={i}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="pokemonImageUrl"
          className="w-[110px] inline-block font-bold"
        >
          Image URL:
        </label>
        <input
          type="text"
          placeholder="www..."
          name="pokemonImageUrl"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          className="border border-pink-300 rounded-lg bg-pink-200 text-black px-3 py-2 my-4 mx-3 placeholder:text-white"
        />
      </div>

      <div className="mt-10 flex items-center justify-center">
        <button
          type="submit"
          className="bg-pink-400 text-white px-5 py-2 rounded-full mr-5"
        >
          Create
        </button>
        <button
          type="reset"
          className="bg-slate-400 text-white px-5 py-2 rounded-full mr-5"
        >
          Clear
        </button>
      </div>
    </form>
  )
}

export default PokemonEditForm
