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


export function llamadaApiPOST(entidadJSON, path) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: path,
    headers: {
    },
    data: entidadJSON
  };
  return axios.request(config);
}


export function getEntidades(nombre) {
  return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}`)
}


export function getEntidadPorId(nombre,id) {
  return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}`)
}


export function postEntidades(entidad, nombre) {
  return llamadaApiPOST(entidad,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}`, )
}


export function getCategorias() {
return getEntidades('categorias.json')
}


export function postCategoria(categoria) {
  return postEntidades(categoria,'categorias.json')
}


export function getMateriales() {
  return getEntidades('materiales.json')
}


export function getMaterialPorIdS(id) {
  return getEntidadPorId('material',`${id}.json`)
}



