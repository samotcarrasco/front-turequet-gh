import axios from 'axios'

const host = "http://localhost:8080/"

//Llamada a la API genérica, parametrizada con method, body y path
function llamadaAPI(method, body, path) {
  let config = {
    method: method ?? 'get',
    maxBodyLength: Infinity,
    url: path,
    headers: {}
  }

  if (body) {
    config.data = body,
      config.headers['Content-Type'] = 'application/json'
  }

  return axios.request(config)
}


function llamadaApiPUTParams(path, params = {}) {
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: path,
    headers: {},
    params: params // Añadimos los parámetros a la llamada
  };
  return axios.request(config);
}


// GETS
function getEntidades(nombre) {
  console.log("get all de la entidad", nombre)
  //return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/apit/${nombre}.json`)
  return llamadaAPI('get',null,`${host}api/${nombre}`)
}


function getEntidadPorId(nombre, id) {
  // console.log("get ENTIDAD", nombre, " id ", id, `${host}api/${nombre}/${id}`)
  return llamadaAPI('get', null, `${host}api/${nombre}/${id}`)
}


function getEntidadPorNombre(nombre, campo, valor) {
  //console.log("OBTENIDNDO EL DPTO POR SIGLAS")
  // return llamadaApiGET(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/apit/${nombre}/${campo}/${valor}.json`)
  return llamadaAPI('get',null,`${host}api/${nombre}/${campo}/${valor}`)
}



//POST
function postEntidad(modelo, nombre) {
  // return llamadaApiPOST(modelo,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}.json` )
  return llamadaAPI('post', modelo, `${host}api/${nombre}`)
}


//PUT
function putEntidad(modelo, id, nombre) {
  //return llamadaApiPUT(modelo,`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/apit/${nombre}/${id}.json`, )
  return llamadaAPI('put',modelo, `${host}api/${nombre}/${id}`)
}


function PUTAumentarCretido(nombre, id, creditos) {
  console.log("llamando a put de departamento:" + id + " milis" + creditos)
  return llamadaApiPUTParams(`${host}api/${nombre}/${id}/aumentarCredito`, { cantidad: creditos })
}

// DELETE
function deleteEntidad(id, nombre) {
  //return llamadaApiDELETE(`https://truequet-pre-default-rtdb.europe-west1.firebasedatabase.app/api/${nombre}/${id}.json`, )
  return llamadaAPI('delete',null,`${host}api/${nombre}/${id}`)
}





//CATEGORÍAS

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


//MATERIALES
export function getMateriales() {
  return getEntidades('materiales')
}


export function getMaterialPorId(id) {
  return getEntidadPorId('materiales', id)
}

export function putMaterial(material) {
  console.log("llamando a put ", material, material.id)
  return putEntidad(material, material.id, 'materiales')
}


//DEPARTAMENTOS

export function getDepartamentos() {
  return getEntidades('departamentos')
}

export function getDeptoPorSiglas(valor) {
  return getEntidadPorNombre('departamentos', 'siglas', valor)
}


export function putAumentarCretido(id, creditos) {
  //la personalizamos porque no es un put estandar
  return PUTAumentarCretido('departamentos', id, creditos)
}