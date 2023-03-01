# Week 6 - Challenge 5

## API REST Things I already know
Crea una API REST que se conecte a una base de dato, para manipular recursos de tipo cosas que ya sé. La base de dato contiene un listado de characteres de un videojuego.

La API REST debe tener los siguientes endpoints:

[GET] /things -> devuelve todos los characters

[GET] /things/:idThing -> devuelve uno

[DELETE] /things/:idThing -> borra una

[POST] /things -> crea una characters (la recibe en el body)

[PATCH] /things -> modifica un characters (la recibe en el body)

Usamos express con las capas:

app
router
controller
repo
