import axios from 'axios'

export const host = "https://truequet-carrascodim.b4a.run/"

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
    params: params
  };
  return axios.request(config);
}

export function getEntidades(nombre) {
  return llamadaAPI('get',null,`${host}api/${nombre}`)
}

function getEntidadPorId(nombre, id) {
  return llamadaAPI('get', null, `${host}api/${nombre}/${id}`)
}

function getEntidadPorNombre(nombre, campo, valor) {
  return llamadaAPI('get',null,`${host}api/${nombre}/${campo}/${valor}`)
}

function getEntidadPorParametro(nombre, param, valor) {
  return llamadaAPI('get',null,`${host}api/${nombre}?${param}/${valor}`)
}

function postEntidad(modelo, nombre) {
  return llamadaAPI('post', modelo, `${host}api/${nombre}`)
}

function putEntidad(modelo, id, nombre) {
  return llamadaAPI('put',modelo, `${host}api/${nombre}/${id}`)
}

function patchEntidad(modelo, entidad, id, nombre) {
  return llamadaAPI('patch',modelo, `${host}api/${entidad}/${id}/${nombre}`)
}

function PUTAumentarCretido(nombre, id, creditos) {
  return llamadaApiPUTParams(`${host}api/${nombre}/${id}/aumentarCredito`, { cantidad: creditos })
}

function deleteEntidad(id, nombre) {
  return llamadaAPI('delete',null,`${host}api/${nombre}/${id}`)
}

//Categorías
export function getCategorias() {
  return getEntidades('categorias/categoriasNormales')
}

export function getCategoriasPrincipales() {
  return getEntidades('categorias/categoriasPrincipales')
}

export function getCategoriaPorParametro(paremetro, valor) {
  return getEntidadPorParametro('categorias/buscarCategoria', paremetro, valor)
}

export function getGrupos() {
  return getEntidades('categorias/grupos')
}

export function postCategoria(categoria) {
  return postEntidad(categoria, 'categorias')
}

export function putCategoria(categoria) {
  return putEntidad(categoria, categoria.id, 'categorias')
}

export function deleteCategoria(categoria) {
  return deleteEntidad(categoria.id, 'categorias')
}


//Materiales
export function getMateriales() {
  return getEntidades('materiales')
}

export function getMaterialPorId(id) {
  return getEntidadPorId('materiales', id)
}

export function deleteMaterial(material) {
  return deleteEntidad(material.id, 'materiales')
}

export function putMaterial(material) {
  return putEntidad(material, material.id, 'materiales')
}

export function postMaterial(material) {
  return postEntidad(material, 'materiales')
}

export function patchFechaEntrega(modeloFecha, idMaterial) {
  return patchEntidad(modeloFecha, 'materiales', idMaterial, 'fechaentrega')
}

//Departamentos
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
  return PUTAumentarCretido('departamentos', id, creditos)
}

export function getEmpleos() {
  return getEntidades('departamentos/empleos')
}

export function putDepartamento(departamento) {
 return putEntidad(departamento, departamento.id, 'departamentos')
}


export function deleteDepartamento(departamento) {
  return deleteEntidad(departamento.id, 'departamentos')
}

export function getBonificacion(id) {
  return llamadaAPI('get', null, `${host}api/departamentos/${id}/calcularBonificacion`)
}


// Acuartelamientos
export function getAcuartelamientos() {
  return getEntidades('acuartelamientos')
}

export function getAcuartPorSiglas(siglas) {
  return getEntidadPorNombre('acuartelamientos', 'siglas', siglas)
}

export function postAcuartelamiento(acuart) {
  return postEntidad(acuart, 'acuartelamientos')
}

export function putAcuartelamiento(acuart) {
  return putEntidad(acuart, acuart.id, 'acuartelamientos')
}

export function getBases() {
  return getEntidades('acuartelamientos/siglas')
}

export function getAcuartelamiento(acuart) {
  return putEntidad(acuart, acuart.id, 'acuartelamientos')
}

export function deleteAcuartelamiento(acuart) {
  return deleteEntidad(acuart.id, 'acuartelamientos')
}