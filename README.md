Descripción 
El servicio de fermentos proporciona información sobre todos los fermentos de una tienda en línea. 
El servicio permite a los desarrolladores consultar, crear, actualizar y eliminar la información de los productos existentes. 
Requisitos 
El servicio debe estar disponible a través de HTTP. El servicio debe soportar los siguientes métodos HTTP: GET, POST, PUT y DELETE. 
El servicio debe devolver respuestas en formato JSON. 
Instalación 
Para instalar el servicio, descargue el código fuente del repositorio de GitHub. A continuación, compile el código y ejecute el servicio. 
Uso 
Para consultar los productos, use el siguiente método HTTP: GET /find_Products/:per_page/:page Donde los params equivalen al paginado y numero de elemento por pagina. 
Este método devolverá una lista de todos los productos existentes. 
Para crear un nuevo producto, use el siguiente método HTTP: POST /createProduct 
El cuerpo de la solicitud debe contener los siguientes datos: 
{
    "sku": "10201lj",
    "date_created": "23/04/2024",
    "date_expires": "23/04/2024/05/2024",
    "description": "Queso oaxaca artesanal 100% leche de vaca",
    "category": "Fermento solido",
    "subcategory": "Lacteos",
    "capacity": "1.5kg"
}
Para actualizar la información de un producto, use el siguiente método HTTP: PUT /get_product_by_id/:id El cuerpo de la solicitud debe contener los datos que desea actualizar.
Para eliminar un producto, use el siguiente método HTTP: DELETE /deleteProduct/:id 
