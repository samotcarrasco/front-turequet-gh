import axios from 'axios'

const host ="http://localhost:8080"
export function llamadaApiGET(path) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: path,
    headers: {}
  }

  return axios.request(config)
}

export function getEntidades(nombre) {
  return llamadaApiGET(`${host}/api/${nombre}`)
}


export function getCategorias() {
return getEntidades('categorias.json')
}
