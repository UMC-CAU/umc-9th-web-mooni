import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MovieDetail, CastMember, CrewMember } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?&language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        const creditsRes = await axios.get<{
          cast: CastMember[];
          crew: CrewMember[];
        }>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?&language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(movieResponse.data);

        const topCast = creditsRes.data.cast.slice(0, 15);
        const directorInfo = creditsRes.data.crew.find(
          (person) => person.job === "Director"
        );

        setCast(topCast);
        setDirector(directorInfo || null);
      } catch {
        setError("영화 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return null;

  return (
    <div className="relative bg-black text-white min-h-screen">
      {/* 배경 이미지 */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* 포스터 + 제목 섹션 */}
        <div className="absolute bottom-16 left-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* 포스터 */}
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-40 md:w-56 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* 텍스트 정보 */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-3">
              {movie.title}
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              ⭐ {movie.vote_average.toFixed(1)} |{" "}
              {movie.release_date?.slice(0, 4)} | {movie.runtime}분
            </p>
            <p className="italic text-gray-200 mb-6 line-clamp-3">
              {movie.overview}
            </p>
            <div className="flex gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md shadow-lg transition-colors">
                ▶ 재생
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md transition-colors">
                + 내 리스트
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 줄거리 */}
      <section className="px-10 py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">줄거리</h2>
        <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
      </section>

      {/* 감독 & 출연 */}
      <section className="px-10 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">감독 및 출연진</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* 감독 */}
          {director && (
            <div className="text-center">
              {director.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                  alt={director.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-2 border-gray-600 hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center text-2xl text-gray-500 mx-auto mb-3">
                  ?
                </div>
              )}
              <p className="font-semibold text-white">{director.name}</p>
              <p className="text-sm text-gray-400">Director</p>
            </div>
          )}

          {/* 출연 배우 */}
          {cast.map((person) => (
            <div key={person.id} className="text-center">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-2 border-gray-600 hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center text-2xl text-gray-500 mx-auto mb-3">
                  ?
                </div>
              )}
              <p className="font-semibold text-white">{person.name}</p>
              <p className="text-sm text-gray-400">{person.character}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default MovieDetailPage;
