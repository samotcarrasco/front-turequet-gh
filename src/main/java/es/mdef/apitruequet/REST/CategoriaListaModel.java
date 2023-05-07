package es.mdef.apitruequet.REST;

import java.util.List;

import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.Relation;

import es.mdef.apitruequet.entidades.Material;
import es.mdef.apitruequet.entidades.Categoria.TipoGrupo;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Relation(collectionRelation="categorias")
public class CategoriaListaModel extends RepresentationModel<CategoriaListaModel>{
	
	private Long id;
	private String categoria;
	private String descripcion;
	private TipoGrupo grupo;
	private int minMilis;
	private int maxMilis;
	private int numMateriales;

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public TipoGrupo getGrupo() {
		return grupo;
	}

	public void setGrupo(TipoGrupo grupo) {
		this.grupo = grupo;
	}

	public int getMinMilis() {
		return minMilis;
	}

	public void setMinMilis(int minMilis) {
		this.minMilis = minMilis;
	}

	public int getMaxMilis() {
		return maxMilis;
	}

	public void setMaxMilis(int maxMilis) {
		this.maxMilis = maxMilis;
	}


	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public int getNumMateriales() {
		return numMateriales;
	}
	
	public void setNumMateriales(int numMateriales) {
		this.numMateriales = numMateriales;
	}
	

	@Override
	public String toString() {
		return "Categoria MODELO [id=" + getId() + ", nombre" + getCategoria() + "]";
	}
	
	
}
