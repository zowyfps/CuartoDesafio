const express = require('express');
const { Router } = require('express');
const Contenedor = require('./Contenedor');

let container = new Contenedor('./productos.txt');

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(PORT, () => {console.log(`Server Port ${PORT}`);})


const routerProducts = Router();

routerProducts.get('/', async(req,res) => {
    const products = await container.getAll()
    res.json({
        products
    })
})

routerProducts.get('/:id', async(req,res) => {
    const id = parseInt(req.params.id);
    //console.log(id);
    const item = await container.getById(id);
    //console.log(item);

    if(isNaN(id)){
        res.json({
            error: "El parametro ingresado no es un numero"
        })
    } else {
        item == undefined ? res.json({error: "El id esta fuera de rango"}) : res.json({item});
    }

})

routerProducts.post('/', async(req,res) => {

    let product = req.body;
    await container.save(product)

    res.json({
        product
    })
})

routerProducts.put('/:id', async(req,res) => {
    
    let { title, price, thumbnail } = req.body;

    const id = parseInt(req.params.id);
    //console.log(id);
    let item = await container.getById(id);
    item["title"] = title;
    item["price"] = price;
    item["thumbnail"] = thumbnail;

    //Spread
    const newItem = {
    "title" : title,
    "price" : price,
     "thumbnail" : thumbnail,
     ...item
    }

    await container.deleteById(item.id);
    await container.overwrite(newItem);

    if(isNaN(id)){
        res.json({
            error: "El parametro ingresado no es un numero"
        })
    } else {
        item == undefined ? res.json({error: "El id esta fuera de rango"}) : res.json({newItem});
    }

})

routerProducts.delete('/:id', async(req,res) => {
    const id = parseInt(req.params.id);
    //console.log(id);
    const item = await container.deleteById(id);
    //console.log(item);

    if(isNaN(id)){
        res.json({
            error: "El parametro ingresado no es un numero"
        })
    } else {
        item == undefined && res.json({msg: "El producto fue borrado exitosamente"});
    }

})


app.use('/api/productos', routerProducts);