# Pesquisa de Placas no Estado da Paraíba


## Como usar?

```shell
npm i search-plate-pb 
```

```js
const { searchPlate } = require('search-plate-pb')

const plate = await searchPlate('XXX1234')
```

- searchPlate(plate_number): 
    Função que retorna diversas informações a respeito da placa passada como parâmetro