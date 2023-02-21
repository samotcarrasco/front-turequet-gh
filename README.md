# TRUEQUET

**Descripción**

Este Proyecto surge debido a que en las Unidades del Ejército la gran mayoría de las veces no se tiene una cantidad óptima de material. En ocasiones sobra material y en ocasiones falta material.

Con el desarrollo de este Proyecto, las Unidades de una Base o Acuartelamiento podrán ofertar al resto de Unidades su material sobrante, así como solicitar material sobrante de otra Unidad. Este material podrá ser de tipo inventariable o de tipo no inventariable.

Con la finalidad de que las Unidades se vean motivadas a ofertar material, y no se dediquen solamente a solicitar material, se crea un tipo de economía en la propia aplicación. Los materiales ofertados darán créditos a la Unidades, que a su vez les permitirá solicitar materiales. Por otro lado, los materiales no inventariables que se oferten, tendrán una bonificación extra de créditos. Esta bonificación dependerá del material (materiales más difíciles de ser solicitados, mayor bonificación tendrán).

## DIAGRAMA DE CLASES
![Proyecto](/uploads/dcd1833dc43dc120a2f22e7285901dd3/Proyecto.jpg)

**Cumplimiento de requisitos**

1. **Herencia:** entre la clase abstracta `Material` y las entidades `MaterialInventariable`y `MaterialNoInventariable`. 
2. **Relación One-To-Many:** entre la entidad `Unidad`y `Material`.
3. **Método personalizado:** método que calcula el crédito disponible de cada Unidad según el material que ha ofertado y que ha solicitado, teniendo en cuenta la bonificación extra de créditos que produce el ofertar materiales no inventariables.
4. **Listado:** Se mostrará la lista de material disponible que tiene una Unidad. 
5. **CRUD:** Se podrá crear, consultar, actualizar y eliminar el material de una Unidad.
6. **URLs del proyecto:** https://git.institutomilitar.com/VICENTEEC/truequet
7. **Despliegue en Internet:**

    * API: pendiente.
    * Web: pendiente.
