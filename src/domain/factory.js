/**
 * Fábrica de Obras — converte respostas brutas do TMDB nas subclasses
 * apropriadas (Filme, Documentario, Serie, Minisserie, Episodio).
 *
 * Ponto-chave da Modelagem Universal (req. 3.2.1): a interface da aplicação
 * trabalha com `Obra` (polimorficamente). Esta fábrica é o único lugar que
 * "sabe" os formatos do TMDB.
 */

import Obra from './Obra.js'
import Filme from './Filme.js'
import Documentario from './Documentario.js'
import Serie from './Serie.js'
import Minisserie from './Minisserie.js'
import Episodio from './Episodio.js'

const TMDB_GENERO_DOCUMENTARIO = 99

export function obraDeFilmeTmdb(data) {
  const generos = (data.genres || []).map((g) => g.name)
  const props = {
    id: data.id,
    titulo: data.title || data.original_title,
    posterPath: data.poster_path,
    dataLancamento: data.release_date,
    generos,
    sinopse: data.overview,
    runtime: data.runtime || 0,
    diretores: extrairDiretoresDeCredits(data),
  }
  const ehDoc =
    (data.genres || []).some((g) => g.id === TMDB_GENERO_DOCUMENTARIO) ||
    (data.genre_ids || []).includes(TMDB_GENERO_DOCUMENTARIO)
  return ehDoc ? new Documentario(props) : new Filme(props)
}

export function obraDeSerieTmdb(data) {
  const generos = (data.genres || []).map((g) => g.name)
  const numEp = data.number_of_episodes || 0
  const tempRuntime = (data.episode_run_time || [])[0] || 0
  const props = {
    id: data.id,
    titulo: data.name || data.original_name,
    posterPath: data.poster_path,
    dataLancamento: data.first_air_date,
    generos,
    sinopse: data.overview,
    numTemporadas: data.number_of_seasons || 0,
    numEpisodios: numEp,
    duracaoMediaEpisodio: tempRuntime,
    criadores: (data.created_by || []).map((c) => c.name),
  }
  if (data.type === 'Miniseries') return new Minisserie(props)
  return new Serie(props)
}

export function obraDeEpisodioTmdb(data, contexto = {}) {
  return new Episodio({
    id: data.id,
    titulo: data.name || `Episódio ${data.episode_number}`,
    posterPath: data.still_path,
    dataLancamento: data.air_date,
    sinopse: data.overview,
    serieId: contexto.serieId,
    serieTitulo: contexto.serieTitulo,
    numeroTemporada: data.season_number,
    numeroEpisodio: data.episode_number,
    runtime: data.runtime || 0,
  })
}

function extrairDiretoresDeCredits(data) {
  const crew = data.credits?.crew || []
  return crew.filter((c) => c.job === 'Director').map((c) => c.name)
}

/**
 * Recria uma Obra a partir do índice serializado em localStorage.
 * O campo `tipo` (string) é o discriminador.
 */
export function obraDeIndice(item) {
  if (!item) return null
  const props = {
    id: item.id,
    titulo: item.titulo,
    posterPath: item.posterPath,
    dataLancamento: item.dataLancamento,
    generos: item.generos || [],
  }
  switch (item.tipo) {
    case 'Filme':
      return new Filme({ ...props, runtime: item.runtime, diretores: item.diretores })
    case 'Documentário':
      return new Documentario({ ...props, runtime: item.runtime, diretores: item.diretores })
    case 'Série':
      return new Serie({
        ...props,
        numTemporadas: item.numTemporadas,
        numEpisodios: item.numEpisodios,
        duracaoMediaEpisodio: item.duracaoMediaEpisodio,
        criadores: item.criadores,
      })
    case 'Minissérie':
      return new Minisserie({
        ...props,
        numTemporadas: item.numTemporadas,
        numEpisodios: item.numEpisodios,
        duracaoMediaEpisodio: item.duracaoMediaEpisodio,
        criadores: item.criadores,
      })
    case 'Episódio':
      return new Episodio({
        ...props,
        serieId: item.serieId,
        serieTitulo: item.serieTitulo,
        numeroTemporada: item.numeroTemporada,
        numeroEpisodio: item.numeroEpisodio,
        runtime: item.runtime,
      })
    default:
      return null
  }
}

export { Obra, Filme, Documentario, Serie, Minisserie, Episodio }
