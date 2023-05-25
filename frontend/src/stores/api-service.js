import axios from 'axios'

//export const host = "https://truequet-carrascodim.b4a.run/"
export const host = "http://localhost:8080/"

//Llamada a la API genérica, parametrizada con method, body y path
export function llamadaAPI(method, body, path) {
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
export function getEntidades(nombre) {
  console.log("get all de la entidad", nombre)
  return llamadaAPI('get',null,`${host}api/${nombre}`)
}


function getEntidadPorId(nombre, id) {
  // console.log("get ENTIDAD", nombre, " id ", id, `${host}api/${nombre}/${id}`)
  return llamadaAPI('get', null, `${host}api/${nombre}/${id}`)
}


// function getEntidadPorLink(nombre) {
//   // console.log("get ENTIDAD", nombre, " id ", id, `${host}api/${nombre}/${id}`)
//   return llamadaAPI('get',null,`${host}api/${nombre}`)
// }


function getEntidadPorNombre(nombre, campo, valor) {
  //console.log("OBTENIDNDO EL DPTO POR SIGLAS")
  return llamadaAPI('get',null,`${host}api/${nombre}/${campo}/${valor}`)
}

//POST
function postEntidad(modelo, nombre) {
  return llamadaAPI('post', modelo, `${host}api/${nombre}`)
}


//PUT
function putEntidad(modelo, id, nombre) {
  return llamadaAPI('put',modelo, `${host}api/${nombre}/${id}`)
}

//PATCH
function patchEntidad(modelo, entidad, id, nombre) {
  return llamadaAPI('patch',modelo, `${host}api/${entidad}/${id}/${nombre}`)
}


function PUTAumentarCretido(nombre, id, creditos) {
  console.log("llamando a put de departamento:" + id + " milis" + creditos)
  return llamadaApiPUTParams(`${host}api/${nombre}/${id}/aumentarCredito`, { cantidad: creditos })
}

// DELETE
function deleteEntidad(id, nombre) {
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

export function deleteMaterial(material) {
  console.log("llamando a delete ", material, material.id)
  return deleteEntidad(material.id, 'materiales')
}

export function putMaterial(material) {
  console.log("llamando a put ", material, material.id)
  return putEntidad(material, material.id, 'materiales')
}

export function postMaterial(material) {
  return postEntidad(material, 'materiales')
}



export function patchFechaEntrega(modeloFecha, idMaterial) {
  return patchEntidad(modeloFecha, 'materiales', idMaterial, 'fechaentrega')
}

//DEPARTAMENTOS

export function getDepartamentos() {
  return getEntidades('departamentos')
}

export function getDeptoPorSiglas(valor) {
  return getEntidadPorNombre('departamentos', 'siglas', valor)
}

export function postDepartamento(dpto) {
  return postEntidad(dpto, 'departamentos')
}


export function putAumentarCretido(id, creditos) {
  //la personalizamos porque no es un put estandar
  return PUTAumentarCretido('departamentos', id, creditos)
}

export function getEmpleos() {
  return getEntidades('departamentos/empleos')
}

export function putDepartamento(departamento) {
  console.log("llamando a put ", departamento, departamento.id)
  return putEntidad(departamento, departamento.id, 'departamentos')
}


export function deleteDepartamento(departamento) {
  console.log("llamando a delete ", departamento, departamento.id)
  return deleteEntidad(departamento.id, 'departamentos')
}



//método personalizado
export function getBonificacion(id) {
  // console.log("get ENTIDAD", nombre, " id ", id, `${host}api/${nombre}/${id}`)
  return llamadaAPI('get', null, `${host}api/departamentos/${id}/calcularBonificacion`)
}