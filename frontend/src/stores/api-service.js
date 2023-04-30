import axios from 'axios'

//const host = "https://apipreguntasdim-samotcarrasco.b4a.run/"
//const host = "http://localhost:8080/"

function llamadaApiGET(path) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: path,
    headers: {}
  }

  return axios.request(config)
}


function llamadaApiPOST(modeloJSON, path) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: path,
    headers: {
    },
    data: modeloJSON
  };
  return axios.request(config);
}

function llamadaApiPUT(modeloJSON, path) {
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: path,
    headers: {
    },
    data: modeloJSON
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
  return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/apit/${nombre}.json`)
  //return llamadaApiGET(`${host}api/${nombre}`)
}


function getEntidadPorId(nombre, id) {
  //return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}.json`)
  //return llamadaApiGET(`${host}api/${nombre}/${id}`)
}


function getEntidadPorNombre(nombre, campo, valor) {
    console.log("OBTENIDNDO EL DPTO POR SIGLAS")
   return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/apit/${nombre}/${campo}/${valor}.json`)
   //return llamadaApiGET(`${host}api/${nombre}/${id}`)
}


function postEntidad(modelo, nombre) {
  // return llamadaApiPOST(modelo,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}.json` )
  return llamadaApiPOST(modelo, `${host}api/${nombre}`)
}

function putEntidad(modelo, id, nombre) {
  return llamadaApiPUT(modelo,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/apit/${nombre}/${id}.json`, )
  //return llamadaApiPUT(modelo, `${host}api/${nombre}/${id}`)
}

function deleteEntidad(id, nombre) {
  //return llamadaApiDELETE(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}.json`, )
  return llamadaApiDELETE(`${host}api/${nombre}/${id}`)
}


export function getCategorias() {
  return getEntidades('categorias')
}


export function postCategoria(categoria) {
  return postEntidad(categoria, 'categorias')
}

export function putCategoria(categoria) {
  console.log("llamando a put ", categoria, categoria.id)
  return putEntidad(categoria, categoria.id, 'categorias')
}

export function deleteCategoria(categoria) {
  console.log("llamando a delete ", categoria, categoria.id)
  return deleteEntidad(categoria.id, 'categorias')
}


export function getMateriales() {
  return getEntidades('materiales')
}


export function getMaterialPorIdS(id) {
  return getEntidadPorId('material', id)
}


export function getDepartamentos() {
  return getEntidades('departamentos')
}

export function getDeptoPorSiglas(valor) {
  return getEntidadPorNombre('departamentos', 'siglas', valor) 
}


export function putMaterial(material) {
  console.log("llamando a put ", material, material.id)
  return putEntidad(material, material.id, 'materiales')
}