import axios from 'axios'

function llamadaApiGET(path) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: path,
    headers: {}
  }

  return axios.request(config)
}


function llamadaApiPOST(entidadJSON, path) {
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

function llamadaApiPUT(entidadJSON, path) {
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: path,
    headers: {
    },
    data: entidadJSON
  };
  return axios.request(config);
}


function llamadaApiDELETE(path) {
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: path,
    headers: {
    },
  };
  return axios.request(config);
}


function getEntidades(nombre) {
  console.log("get all de la entidad", nombre)
  return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}.json`)
}


function getEntidadPorId(nombre,id) {
  return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}.json`)
}


function postEntidad(entidad, nombre) {
  return llamadaApiPOST(entidad,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}.json`, )
}

function putEntidad(entidad, id, nombre) {
  return llamadaApiPUT(entidad,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}.json`, )
}

function deleteEntidad( id, nombre) {
  return llamadaApiDELETE(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}.json`, )
}


export function getCategorias() {
return getEntidades('categorias')
}


export function postCategoria(categoria) {
  return postEntidad(categoria,'categorias')
}

export function putCategoria(categoria) {
  console.log("llamando a put ",categoria,categoria.id)
  return putEntidad(categoria,categoria.id,'categorias')
}

export function deleteCategoria(categoria) {
  console.log("llamando a delete ", categoria, categoria.id)
  return deleteEntidad(categoria.id,'categorias')
}


export function getMateriales() {
  return getEntidades('materiales')
}


export function getMaterialPorIdS(id) {
  return getEntidadPorId('material',id)
}


export function getDepartamentos() {
  return getEntidades('departamentos')
  }