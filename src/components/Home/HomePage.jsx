import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import PokemonCard from "./PokemonCard";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router";
import Searchbar from "./Searchbar";

const ENV = import.meta.env;
const API_URL = ENV.MODE === "development" ? ENV.VITE_DEV_API_URL : ENV.VITE_PROD_API_URL;

const HomePage = () => {
  const pageSize = 5;

  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // search
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const calcPageCount = () => {
    const pc = Math.ceil(totalItems / pageSize);
    setPageCount(pc);
  };

  const fetchData = async () => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const { data: res } = await axios.get(
        `${API_URL}/pokemons?filters[name][$containsi]=${inputValue}&pagination[pageSize]=${pageSize}&pagination[page]=${pageNo}&sort[0]=name:asc`
      );

      const data = res.data;
      const pagination = res.meta.pagination;

      console.log("data", data);
      setData(data);
      setIsFirstPage(pagination.page === 1);
      setIsLastPage(pagination.page === pagination.pageCount);
      setTotalItems(pagination.total);
    } catch (err) {
      setErrorMessage(JSON.stringify(err.message));
      console.log("Error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // const createPokemon = async (formData) => {
  //   try {
  //     if (!formData.name || !formData.type) {
  //       throw new Error("Name and type are required");
  //     }

  //     const res = await axios.post(`${API_URL}/pokemons`, {
  //       data: formData,
  //     });

  //     console.log("POST res:", res);
  //   } catch (err) {
  //     setErrorMessage(JSON.stringify(err.message));
  //     console.log("Error");
  //     console.error(err);
  //   }
  // };

  const goPrev = () => {
    setPageNo((prev) => prev - 1);
  };

  const goNext = () => {
    setPageNo((prev) => prev + 1);
  };

  const goToDetails = (id) => {
    console.log("go to details");
    navigate(`/pokemon/${id}`);
  };

  const goToCreatePage = () => {
    navigate("/pokemon/create");
  };

  useEffect(() => {
    const callFetchData = async () => {
      await fetchData();
    };

    callFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    calcPageCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="p-20">
      <Searchbar inputValue={inputValue} setInputValue={setInputValue} handleSearch={fetchData} />
      {isLoading && <Loading />}
      {!!errorMessage && <p className="my-5 text-red-400">{errorMessage}</p>}

      <Pagination
        pageCount={pageCount}
        goPrev={goPrev}
        goNext={goNext}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        handlePageChange={(pageNo) => {
          console.log("Clicked pageNo", pageNo);
          setPageNo(pageNo);
        }}
        currentPage={pageNo}
      />
      {data.length > 0 ? (
        <div className="flex flex-col justify-center my-10">
          {Array.isArray(data) &&
            data.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} handleClick={() => goToDetails(pokemon.id)} />
            ))}
        </div>
      ) : (
        <p className="text-center my-10">No results found.</p>
      )}
      <button
        onClick={goToCreatePage}
        type="button"
        className="block bg-pink-400 text-white px-7 py-4 rounded-full mx-auto"
      >
        Create
      </button>
    </div>
  );
};

export default HomePage;
