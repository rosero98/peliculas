import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';
import stiles from './App.module.css'

function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = 'a5c3fb3ede946fd8410e2c7a53abb02d'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  // variables de estado

  const [movies, setMovies] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "loading Movies" });
  const [playing, setPlaying] = useState(false);

  // funcion para realizar la peticion por get a la api

  const fetchMovies = async(searchkey) =>{
    const type = searchkey ? "search" : "discover"
    const {data: {results},
    } = await axios.get(`${API_URL}/${type}/movie`,{
      params: {
        api_key: API_KEY,
        query: searchkey,
      },
    });
    setMovies(results)
    setMovie(results[0])

    if(results.length){
      await fetchMovie(results[0].id)
    }
  }

  
  // funcion para la peticion de un solo objeto y mostrar en reproductor de video

  const fetchMovie = async(id)=>{
    const {data} = await axios.get(`${API_URL}/movie/${id}`,{
      params:{
        api_key: API_KEY,
        append_to_response: "videos"
      }
    })
    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === "official trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie)=>{
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }

  // funcion para buscar peliculas
   const searchMovies = (e)=>{
    e.preventDefault();
    fetchMovies(searchkey)
   }

  useEffect(()=>{
    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  
  return (
    <div>
     <header>
        <h1 className={stiles.title}>Trailer Movies</h1>
      </header> 
      
      {/*buscador*/}
  
      <form className='container mb-4' onSubmit={searchMovies}>
        <input type="text" placeholder='search' onChange={(e)=> setSearchkey(e.target.value)}/>
        <button className='btn btn-primary'>Search</button>
      </form>

      {/*aqui va todo el contenedor del baner y del reproductor de video*/}
        <div>
          <main>
            {movie ? (
              <div 
                className="viewtrailer"
                style={{
                  backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                }}
              >
                {playing ? (
                  <>
                    <YouTube 
                      videoId={trailer.key}
                      classname="reproductor container"
                      containerClassname={"youtube-container amru"}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          autoplay: 1,
                          controls: 0,
                          cc_load_policy: 0,
                          fs: 0,
                          iv_load_policy: 0,
                          modestbranding: 0,
                          rel: 0,
                          showinfo: 0,
                        },
                      }}
                    />
                    <button onClick={() => setPlaying(false)} className="boton">
                      close
                    </button>
                  </>
                ) : (
                  <div className="container">
                    <div className="">
                      {trailer ? (
                        <button 
                          className="boton"
                          onClick={() => setPlaying(true)}
                          type="button"
                        >
                          play Trailer
                        </button>
                        ) : (
                          "sorry, no trailer available"
                        )}
                        <h1 className="text-white"> {movie.title}</h1>
                        <p className="text-white"> {movie.overview}</p>
                    </div>
                  </div>

                )}
              </div>
            ) : null}
          </main>
          </div> 

      {/*contenedor que va a mostrar posters de las peliculas actuales*/}
      <div className='container mt-3'>
        <div className='row'>
          {movies.map((movie)=>(
            <div key={movie.id} className="col-md-4 mb-3" onClick={()=> selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%" />
              <h4 className='text-center'>{movie.title}</h4>
             </div> 
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
