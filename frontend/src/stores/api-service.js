import axios from 'axios'

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
  return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}`)
}


export function getCategorias() {
return getEntidades('categorias.json')
}
